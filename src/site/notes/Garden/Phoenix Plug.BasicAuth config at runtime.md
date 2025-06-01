---
{"dg-publish":true,"permalink":"/garden/phoenix-plug-basic-auth-config-at-runtime/","tags":["elixir","phoenix","plug","dev"],"created":"2025-06-01T10:53:11.542+01:00","updated":"2025-06-01T17:02:09.459+01:00"}
---

# Phoenix Plug.BasicAuth config at runtime
HTTP Basic Auth a simple way of restricting access to an app, without introducing a full-blown user authentication system.

Luckily `Plug` comes with `Plug.BasicAuth` already built-in for us to use.

This is the usage example from [the docs](https://hexdocs.pm/plug/Plug.BasicAuth.html) :
```elixir
# lib/my_app.ex
import Plug.BasicAuth
plug :basic_auth, Application.compile_env(:my_app, :basic_auth)

# config/config.exs
config :my_app, :basic_auth, username: "hello", password: "secret"
```
Seems simple enough!  In a real-life Phoenix app, we must probably:
- add the plug to our `Endpoint` module, so we can protect all requests.
- read the config from env variables, so we don't include secrets in our codebase files.

So something like:
```elixir
# lib/my_app_web/endpoint.ex
defmodule MyAppWeb.Endpoint do
  # ...
  import Plug.BasicAuth, only: [basic_auth: 2]
  
  plug :basic_auth, Application.compile_env!(:my_app, :basic_auth)
  # ...
end

# config/config.exs
config :my_app, :basic_auth,
  username: System.get_env("AUTH_USERNAME", "user")
  password: System.get_env("AUTH_PASSWORD", "password")
``` 

## The problem
But what happens if we do it like this and load the config in `config.exs`, as suggested?

This might not seem to matter much while developing locally, but, as soon as we want to build and deploy our app, it means that:

- To change the config we need to recompile and redeploy our code
- We need to have a way to make the secret variables available during build

These  do sound like a bit of a pain...
👉 In fact, **when it comes to env variables and external config, [the elixir docs actively discourage using `config.exs`](https://hexdocs.pm/elixir/config-and-releases.html#configuration), in favour of `runtime.exs`**, which allows us to read configuration during (surprise) runtime.

## Let's fix this
So, can we just move our config into `runtime.exs` and be done?

Not right away! Our plug declaration is currently reading configuration at compile time. How do we know this? If you remember our `Endpoint` definition from above:
```elixir
defmodule MyAppWeb.Endpoint do
  # ...
  plug :basic_auth, Application.compile_env!(:my_app, :basic_auth)
  # ...
end
```
1. We are using `Application.compile_env!/2`. This reads the application environment at compile time
2. And we are calling it in the module body. This is evaluated at compile time.

To fix this, we need to find alternatives for the two things above, so we can read the application environment at runtime:
1. Use a runtime-alternative to `Application.compile_env!/2`. E.g. `Application.fetch_env!/2` 
2. Call within a function body, where it will be evaluated at runtime.

So how do we do this? One way to do this would be to make our own wrapper Plug around the built-in one.

We have two options here: [as a function](https://hexdocs.pm/phoenix/plug.html#function-plugs), or [as a module](https://hexdocs.pm/phoenix/plug.html#module-plugs).
Picking the simplest of the two, let's go with a function:
```elixir
# lib/my_app_web/endpoint.ex
defmodule MyAppWeb.Endpoint do
  # ...
  plug :basic_auth

  # ...
  def basic_auth(conn, _opts) do
    basic_auth_config = Application.fetch_env!(:my_app, :basic_auth)
    Plug.BasicAuth.basic_auth(conn, basic_auth_config)
  end
end
```
We are now reading our config at runtime :)
Then we can just move our config to `runtime.exs`:
```elixir
# config/runtime.exs
config :my_app, :basic_auth,
  username: System.get_env("AUTH_USERNAME", "user")
  password: System.get_env("AUTH_PASSWORD", "password")
```

That's it ✨

PS: If we then want to deploy our app to something like fly.io, we can then configure our secrets like any other secret:
```sh
fly secrets set AUTH_USERNAME=some-other-user AUTH_PASSWORD=very-secret-password
```
or use whatever equivalent env variable/secret management system.

## Key takeaways
- Be mindful of whether your code is reading configuration at compile time or at runtime.
- Most of the time you can and should choose to read at runtime.
- It's usually not too complicated to refactor your code to do so.
- See also: [Application docs on compile-time environment](https://hexdocs.pm/elixir/1.12/Application.html#module-compile-time-environment)
