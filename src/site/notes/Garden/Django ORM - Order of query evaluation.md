---
{"dg-publish":true,"permalink":"/garden/django-orm-order-of-query-evaluation/","tags":["python","django","sql","outdated","how-to"],"created":"2024-03-03T10:39:45.174+00:00","updated":"2024-03-03T14:50:10.628+00:00"}
---

# Django ORM - Order of query evaluation

Original publication date: Aug. 12, 2016

When working with an ORM it is often easy to forget that whatever you write is ultimately translated to SQL queries.

Consider this script:

```python
bookings = task.contractor.bookings.all()
task.delete()
bookings.delete()
```

This will run with no errors.

As you would expect`task` **will be deleted**, however the `bookings` **will persist in the db**! What's going on?

The code above will result in 2 SQL queries:

1. One that deletes the task based on the task id
2. One that deletes bookings that appear as a foreign key to the related contractor table, via the related tasks table filtered by... the same task id that was just deleted!

As the task is deleted in the 1st query, then the 2nd query will yield no results (as the specific task id will no longer exist).

For this to work we just need to reverse the order of operations:

```python
bookings = task.contractor.bookings.all()
bookings.delete()
task.delete()
```