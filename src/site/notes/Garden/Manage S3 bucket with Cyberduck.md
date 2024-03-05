---
{"dg-publish":true,"permalink":"/garden/manage-s3-bucket-with-cyberduck/","tags":["how-to","aws"],"created":"2024-03-05T18:37:40.313+01:00","updated":"2024-03-05T18:45:13.671+01:00"}
---

# Manage S3 bucket with Cyberduck 🦆

Manage S3 "files" (objects) using [Cyberduck](https://cyberduck.io/).
There's quite a bit of [documentation](https://docs.cyberduck.io/protocols/s3/), but there are suggested I didn't like, like a user with full S3 permissions, and some parts that didn't work (e.g. bucket name as server url). 

Here's what did work for me:
1. [[Garden/Setup an IAM user to manage an S3 bucket\|Setup an IAM user to manage an S3 bucket]]
2. Set up an `S3 (HTTPS)` bookmark in Cyberduck:
	1. Provide the `Access Key ID` and `Secret Access Key`.
	   PS: if you forgot to write these down, you can recreate them.
	2. Set `Server` to `s3.amazonaws.com`
	3. Set `More Options -> Path` to the name of your bucket, e.g. `/blog-assets.example.com`
3. That's it 🍰