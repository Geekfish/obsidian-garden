---
{"dg-publish":true,"permalink":"/garden/hosting-obsidian-s3-media-publicly/","tags":["how-to","aws"],"created":"2024-03-05T13:48:26.787+00:00","updated":"2024-08-09T13:06:35.032+01:00"}
---

# Hosting Obsidian on media publicly

There are multiple options when we want to host media and larger files and serve them on the web.

Here's my setup for making any asset available through S3 (storage) and **Cloudfront** (CDN) on AWS, to take advantage of my existing account and the numerous tools and guides that already exist.
## Public bucket? No thanks!
Many similar tutorials suggest allowing public read access to S3 buckets. [This may not be a great idea](https://medium.com/@maciej.pocwierz/how-an-empty-s3-bucket-can-make-your-aws-bill-explode-934a383cb8b1). In this walkthrough we're going to use Cloudfront together with S3, to manage the content delivery. This means that the S3 bucket itself doesn't need to be public. Content is published only through Cloudfront.
## Rough steps
1. [[Garden/obsidian-public-media/Setup S3 bucket for use with Cloudfront\|Setup S3 bucket for use with Cloudfront]]
2. [[Garden/obsidian-public-media/Setup custom AWS CloudFront CNAME\|Setup custom AWS CloudFront CNAME]]
3. [[Garden/obsidian-public-media/Setup an IAM user to manage an S3 bucket\|Setup an IAM user to manage an S3 bucket]]
4. [[Garden/obsidian-public-media/Upload the media to your S3 bucket\|Upload the media to your S3 bucket]]

## Notes

