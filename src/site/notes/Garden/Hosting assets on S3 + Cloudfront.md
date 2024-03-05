---
{"dg-publish":true,"permalink":"/garden/hosting-assets-on-s3-cloudfront/","tags":["how-to","aws"],"created":"2024-03-05T14:48:26.787+01:00","updated":"2024-03-05T19:16:41.422+01:00"}
---

# Hosting assets on S3 + Cloudfront

There are multiple options when we want to host media and larger files and serve them on the web.

Here's my manual setup for making any asset available through S3 (storage) and Cloudfront (CDN) on AWS, to take advantage of my existing account and the numerous tools and guides that already exist.
## Rough steps
1. [[Garden/Setup S3 bucket for use with Cloudfront\|Setup S3 bucket for use with Cloudfront]]
2. [[Garden/Setup custom AWS CloudFront CNAME\|Setup custom AWS CloudFront CNAME]]
3. [[Garden/Setup an IAM user to manage an S3 bucket\|Setup an IAM user to manage an S3 bucket]]
4. [[Garden/Manage S3 bucket with Cyberduck\|Manage S3 bucket with Cyberduck]]

## Notes
* This currently requires some manual work of uploading the file to S3 and linking to it from the note using the public Cloudfront URL.
* A nice thing about this is that the bucket itself doesn't need to be public. Content (could also be just one specific directory) is published only through Cloudfront.
 * There is also an Obsidian plugin for storing files on S3 ( https://github.com/jvsteiner/s3-image-uploader)
