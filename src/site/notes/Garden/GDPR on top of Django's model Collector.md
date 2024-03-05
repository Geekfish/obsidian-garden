---
{"dg-publish":true,"permalink":"/garden/gdpr-on-top-of-django-s-model-collector/","tags":["python","django","gdpr","outdated","how-to"],"created":"2024-03-03T11:42:31.050+01:00","updated":"2024-03-05T13:16:52.390+01:00"}
---


# GDPR on top of Django's model Collector

Original publication date: Sep. 30 2018
[Django meetup presentation](https://speakerdeck.com/geekfish/gdpr-plus-django-model-collector)

In the rise of GDPR many organisations have started implementing more and more features to deal with "housekeeping" of user data, compliance with new data processing/retention policies and explicit requests for data export or removal.

In practice, it can be hard to figure out all the possible connections of related data when given a specific user entity. In the context of complex relational databases, we are probably faced with inspecting large trees of relations and constraints.

Django tries to partially solve this problem by defining and managing most relations and constraints on the application level. Users of the Django admin may be familiar with this delete confirmation view:

![Django Admin user deletion view](https://blog-assets.eleni.co/media/django_admin_delete.png)

This is possible because Django contains an object collector that will lookup those relations. When we run `user.delete()` Django will not just execute

```sql
DELETE FROM `myapp_users` WHERE `myapp_users`.`id` = x
```

but will first traverse all relations and collect all directly and indirectly related objects, which it will then clean up as appropriate. According to [Django docs](https://docs.djangoproject.com/en/2.1/ref/models/fields/#django.db.models.CASCADE) no ON DELETE CASCADE rule is ever defined in the DB, it is just emulated by the ORM.

While it can sometimes be frustrating to not have the DB fully manage those relations, we can, in some cases, use this Django feature to our advantage.

### Collect data for export

> Can we find out what data we have on this user?

This question pops up more and more frequently since the implementation of GDPR. The common use-case is when a user asks for an export of their data.

If we wanted to use the Django collector to get all related models for a given model, we could write something like:

```python
from django.contrib.admin.utils import NestedObjects
  
def collect_user_data(user):
    collector = NestedObjects(using="replica")
    collector.collect([user])
    return collector.data
```

This would return all data related to our user instance (as long as the ORM knows about the relations).

This can be built upon for more complex cases:

```python
from django.contrib.admin.utils import NestedObjects

# Imaginary module, used as an example
from myapp.housekeeping import collect, IP_ASSOCIATED_MODELS 


class CustomUserCollector(NestedObjects):
    def __init__(self, user, *args, **kwargs):
        self.user = user
        if 'using' not in kwargs:
            kwargs['using'] = "replica"
        super(CustomUserCollector, self).__init__(*args, **kwargs)

    def collect_from_db(self):
        self.collect([self.user])
        
        # Maybe we have some models that don't have a FK to user,
        # but are still somehow associated...
        for model in IP_ASSOCIATED_MODELS:
            self.collect(
                model.objects.filter(ip__in=self.user.known_ips))
    
    def collect_from_nonrel(self):
        # Maybe we have other types of stores in our system
        # that may contain more user data...
        self.data['couchdb'] = collect.from_couchdb(user)
        self.data['redis_temp'] = collect.from_redis(user)

    def collect_remote(self):
        # Maybe there is an internal API where we store user data
        # with its own export mechanism
        self.data['some_ext_service'] = collect.from_api(user)

    def collect_all():
        self.collect_from_db()
        self.collect_from_nonrel()
        self.collect_remote()


def collect_user_data(user):
    collector = CustomUserCollector(user)
    collector.collect_all()
    return collector.data
```

### Report on deleted data

> Can we keep track of how much data we're deleting?

So, we've been happily collecting and exporting data, but now it's time to delete some of it. Maybe we need to remove accounts after receiving deletion requests from users, or we may need to tidy up after data that's no longer used.

Deleted data is data we no longer need to really worry about (DISCLAIMER: I enjoy deleting stuff, including code).

If you simply remove an instance through the ORM, you will get back a summary of what was deleted. [From the Django docs](https://docs.djangoproject.com/en/2.1/topics/db/queries/#deleting-objects)

```python
Entry.objects.filter(pub_date__year=2005).delete()
# (5, {'webapp.Entry': 5})
```

Behind the scenes, django uses the same model collector to figure out what needs to be deleted and create a report.

A more complex deletion script could look something like:

```python
def delete_all_the_things():
    inactive_users = fetch_inactive_users()
    inactive_users.delete()
    
    users_pending_delete = fetch_pending_deletes()  
    users_pending_delete.delete()
      
    for mailing_list in mailing_lists:
        unconfirmed_subs = fetch_unconfirmed_subs(mailing_list)
        unconfirmed_subs.delete()  

    # ...
```

etc.

If we wanted to check how many things we've just deleted, we would need to collect the output of each `.delete()` or log the individual statements.  
We could also collect them and produce a summary, using an accumulator:

```python
class DeleteStats(object):
    def __init__(self, delete_output=None):
        super(DeleteStats, self).__init__()
        self.total_removed = 0
        self.removed_by_model = defaultdict(int)

        if delete_output:
            self.extend(delete_output)

    def extend(self, delete_output):
        total_removed, removed_by_model = delete_output

        self.total_removed += total_removed
        for _model, _count in removed_by_model.iteritems():
            self.removed_by_model[_model] += _count

        return self

    def __getitem__(self, index):
        # Pretend to be a tuple to match how the django API returns deletes
        if index == 0:
            return self.total_removed
        elif index == 1:
            return self.removed_by_model
        raise IndexError()
```

[also available as a Gist with mini-docs](https://gist.github.com/Geekfish/5b171fd76f0990343d06ac3194497383)

```python
import logging  
from myapp.housekeeping import DeleteStats

logger = logging.getLogger(__name__)

def delete_all_the_things(): 
    stats = DeleteStats()  
 
    inactive_users = fetch_inactive_users()
    stats.extend(inactive_users.delete())
    
    users_pending_delete = fetch_pending_deletes()  
    stats.extend(users_pending_delete.delete())
          
    for mailing_list in mailing_lists:
        unconfirmed_subs = fetch_unconfirmed_subs(mailing_list)
        stats.extend(unconfirmed_subs.delete())  
  
    # ...  
    total_deleted, removed_by_model = stats  

    logger.info("Deleted {} objects in total".format(total_removed))

    for model_name, count in removed_by_model.iteritems():
          logger.info("- {model_name} deleted: {count}".format(
                model_name=model_name, count=count))
```

IRL, instead of one long function, you could pass the accumulator into your cleanup functions, implement your own re-usable logging etc.

### Gotchas

- **Performance**. When the collector traverses and fetches all these relations, things can get pretty slow. On bulk-deletes, Django will detect if a model requires further cleanup of related objects and can end up **iterating** over each object marked for deletion (have a look at `django.db.models.deletion.Collector#delete` if you are curious to see how it works).
    
- **Over-relying on automated data discovery**:  
    One size might not fit all (including all of your Django models in all their different shapes...).  
    **Auto-discovered data may not be relevant**. This sounds a bit silly, but imagine an export of:
    
    ```json
    {
        "id": 12345,
        "first_name": "Bob",
        "password": "pbkdf2_sha256$...rlP2U5X9BuFEGF6603k=",  
        ... 
    }
    ```
    
    The user does not need to know their password hash. They may not need to know meta data related to some UI setting, or denormalised data relevant only for performance enhancement. In addition:  
    **Auto-discovered data may require more context**. Imagine an export of:
    
    ```json
    {
      "id": 12345,
        "first_name": "Linda",
        "recent_actions": [
            "id": 5,
            "timestamp": 1538317086,
        ],  
        ... 
    }
    ```
    
    Without any additional context, action `"id": 5` means absolutely nothing to the user or any 3rd party.
    
    For both of the above, consider creating an explicit **transformation/serialisation layer** that can add or remove fields as appropriate (I've used [`Serializer` from the DRF](http://www.django-rest-framework.org/api-guide/serializers/) for that purpose in the past, probably worthy of its own post)
    

Finally, **a one-off automated solution is not a replacement for solid process**. New features will be added. New services will be deployed. Data will change form and move about. It is worth having a data-housekeeping checklist to reference in every change, to ensure that your automated processes stay up to date.