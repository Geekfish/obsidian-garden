---
{"dg-publish":true,"permalink":"/garden/obsidian-public-media/upload-the-media-to-your-s3-bucket/","tags":["how-to","aws","obsidian"],"created":"2024-03-05T17:37:40.313+00:00","updated":"2024-08-09T13:12:12.290+01:00"}
---

# Upload the media to your S3 bucket
Part of: [[Garden/Hosting Obsidian S3 media publicly\|Hosting Obsidian S3 media publicly]]

Make sure you have followed the previous steps:
1. [[Garden/obsidian-public-media/Setup S3 bucket for use with Cloudfront\|Setup S3 bucket for use with Cloudfront]]
2. [[Garden/obsidian-public-media/Setup custom AWS CloudFront CNAME\|Setup custom AWS CloudFront CNAME]]
3. [[Garden/obsidian-public-media/Setup an IAM user to manage an S3 bucket\|Setup an IAM user to manage an S3 bucket]]
## Use the Obsidian Plugin
You can use the excellent [S3 Image Uploader plugin](https://github.com/jvsteiner/s3-image-uploader) to automatically upload images to your S3 bucket.
### Installation
You can find the plugin in the list of Obsidian community plugins.
### Configure credentials for upload
1. Provide the `Access Key ID` and `Secret Access Key` from the IAM you've previously created.
2. Provide your bucket's region (e.g. `eu-central-1`)
3. Provide your bucket's name (e.g. `assets.example.com`)
### Configure Cloudfront URL
The final step is to configure the domain we previously setup:
1. Enable `Use custom image URL`
2. Set `Custom Image URL` to the domain you previously configured with Cloudfront (e.g. `assets.example.com`). For example for this blog:
	![image](https://blog-assets.eleni.co/f1d7d55a5eb8f3cb59fcdc9790afd84b.png)

## Manual Alternative: Manage S3 bucket with Cyberduck 🦆
You can also manually manage S3 "files" (objects) using [Cyberduck](https://cyberduck.io/). 
There's quite a bit of [documentation](https://docs.cyberduck.io/protocols/s3/), but there are suggestions I didn't like (e.g. user with full S3 permissions), and some parts that didn't work (e.g. bucket name in the server url). 

Here's what did work for me:
1. [[Garden/obsidian-public-media/Setup an IAM user to manage an S3 bucket\|Setup an IAM user to manage an S3 bucket]]
2. Set up an `S3 (HTTPS)` bookmark in Cyberduck:
	1. Provide the `Access Key ID` and `Secret Access Key`.
	   PS: if you forgot to write these down, you can recreate them.
	2. Set `Server` to `s3.amazonaws.com`
	3. Set `More Options -> Path` to the name of your bucket, e.g. `/assets.example.com`
3. That's it 🍰