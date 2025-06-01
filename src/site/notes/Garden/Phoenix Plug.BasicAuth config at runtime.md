---
{"dg-publish":true,"permalink":"/garden/phoenix-plug-basic-auth-config-at-runtime/","tags":["elixir","phoenix","plug","dev"],"created":"2025-06-01T10:53:11.542+01:00","updated":"2025-06-01T15:18:35.659+01:00"}
---

# Phoenix Plug.BasicAuth config at runtime
HTTP Basic Auth a simple way of restricting access to an app, without introducing a full-blown user authentication system.

Luckily `Plug` comes with `Plug.BasicAuth` already built-in for us to use.

This is the recommended usage from [the docs](https://hexdocs.pm/plug/Plug.BasicAuth.html) :
```elixir
# lib/your_app.ex
import Plug.BasicAuth
plug :basic_auth, Application.compile_env(:my_app, :basic_auth)

# config/config.exs
config :my_app, :basic_auth, username: "hello", password: "secret"
```
Seems simple enough.  In a real-life deployment, our config would probably read this config from env variables:
```elixir
config :my_app, :basic_auth,
  username: System.get_env("AUTH_USERNAME", "user")
  password: System.get_env("AUTH_PASSWORD", "password")
``` 
since we don't want to include secret credentials in our config files.

But what happens if we put this in `config.exs`, as suggested?

This might not seem to matter much while developing locally, but, as soon as we want to build and deploy our app, it means that:

- To change the config we need to recompile and redeploy our code
- We need to have a way to make the variables available during build

👉 In fact, **when it comes to env variables and external config, [the elixir docs actively discourage using `config.exs`](https://hexdocs.pm/elixir/config-and-releases.html#configuration), in favour of `runtime.exs`.**

So, how can we work around the plug requiring config during compile time?

Let's create our own wrapper!
```elixir
defmodule MyApp.Plugs.BasicAuth do
  @moduledoc """
  Simple wrapper for the built-in Plug.BasicAuth,
  to allow reading configuration during runtime instead of compile-time.
  """

  @behaviour Plug

  # Nothing to do here
  def init(opts), do: opts

  # Let's wrap the original plug implementation:
  def call(conn, _opts) do
    basic_auth_config = Application.fetch_env!(:my_app, :basic_auth)
    Plug.BasicAuth.basic_auth(conn, basic_auth_config)
  end
end
```
And now we can move our config to `runtime.exs`:
```elixir
# config/runtime.exs
config :my_app, :basic_auth,
  username: System.get_env("AUTH_USERNAME", "user")
  password: System.get_env("AUTH_PASSWORD", "password")
```
If we're using Phoenix, we can configure our plug just like:
```elixir
defmodule MyAppWeb.Endpoint do
  # ...
  plug MyApp.Plugs.BasicAuth
end
```
And that's it ✨

If we then want to deploy our app to something like fly.io, we can then configure our secrets like any other secret:
```sh
fly secrets set AUTH_USERNAME=some-other-user AUTH_PASSWORD=very-secret-password
```
or with whatever equivalent secret management system we're using.