---
{"dg-publish":true,"permalink":"/garden/setup-s3-bucket-for-use-with-cloudfront/","tags":["aws","how-to"],"created":"2024-03-05T14:56:41.817+01:00","updated":"2024-08-09T13:33:07.150+02:00"}
---

# Setup S3 bucket for use with Cloudfront

Part of: [[Garden/Hosting assets on S3 + Cloudfront\|Hosting assets on S3 + Cloudfront]]

1. Create an S3 bucket
	e.g. `assets.example.com`
   > [!info] Public or Private?
     > Unless you have a specific public use in mind, you can **keep this bucket private**.
2. Create a Cloudfront distribution
	* As `Origin domain` select your S3 bucket
	* You can leave `Custom SSL Certificate` empty to start with and set it up later (see [[Garden/Setup custom AWS CloudFront CNAME\|Setup custom AWS CloudFront CNAME]])
3. Done 🍰