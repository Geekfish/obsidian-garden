---
{"dg-publish":true,"permalink":"/all-notes/plug-basic-auth-config-at-runtime/","tags":["elixir","phoenix","plug","dev"],"created":"2025-06-01T10:53:11.542+01:00","updated":"2025-06-01T11:32:43.234+01:00"}
---

HTTP Basic Auth is one of the simplest way to restrict access to our app, without introducing a full-blown user authentication system.

Luckily there is an existing plug for Elixir that can help us do exactly this: `Plug.BasicAuth`.

This is the recommended usage from [the docs](https://hexdocs.pm/plug/Plug.BasicAuth.html) :
```elixir
# lib/your_app.ex
import Plug.BasicAuth
plug :basic_auth, Application.compile_env(:my_app, :basic_auth)

# config/config.exs
config :my_app, :basic_auth, username: "hello", password: "secret"
```
Seems simple enough.  In a real-life deployment, our config would probably look something like:
```elixir
config :my_app, :basic_auth,
  username: System.get_env("AUTH_USERNAME", "user")
  password: System.get_env("AUTH_PASSWORD", "password")
``` 

But what happens if we put this in `config.exs`?

We would need to have the ENV variables available at _compile time_.
This might not seem like a big problem for local development, but as soon as we want to build and deploy our app, it means that we need to make these variables available during the build step, rather than during runtime.

In fact, **when it comes to env variables and external config, [the elixir docs actively discourage using `config.exs`](https://hexdocs.pm/elixir/config-and-releases.html#configuration), in favour of `runtime.exs`.**

How can we work around the plug requiring config during compile time?
Let's create our own wrapper!
```

defmodule MyApp.Plugs.BasicAuth do
  @moduledoc """
  Simple wrapper for the built-in Plug.BasicAuth,
  to allow reading configuration during runtime instead of compile-time.
  """

  @behaviour Plug

  def init(opts), do: opts

  def call(conn, _opts) do
    basic_auth_config = Application.fetch_env!(:my_app, :basic_auth)
    Plug.BasicAuth.basic_auth(conn, basic_auth_config)
  end
end
```
And now we can move our config to `runtime.exs`:
```
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

If we want to deploy our app to something like fly.io, we can then configure our secrets like any other secret:
```
fly secrets set AUTH_USERNAME=some-other-user AUTH_PASSWORD=very-secret-password
```
or with whatever equivalent secret manager we're using.