---
{"dg-publish":true,"permalink":"/garden/digital-garden-media-on-s3-cloudfront/","tags":["how-to","aws","obsidian"],"created":"2024-03-05T14:48:26.787+01:00","updated":"2024-03-05T18:38:18.153+01:00"}
---

# Digital Garden media on S3 + Cloudfront

There are multiple options when we want to host media and larger files for an Obsidian vault. In most cases, all files can just live as part of the vault with no problem, unless there are storage-related limitations (e.g. using Obsidian sync which provides limited space).

When we want to publish notes to the web, we may also choose to host small media files in the same way as we do our notes. And _it may just work_ 👍

Depending on our setup, for bigger assets, we may want a more specialised solution.

For this page, _I didn't go into a rabbit-hole of trying to find the best solution_.
Instead I just tried to do with services that I already have:
* [Vercel](https://vercel.com/) where I'm hosting this page on a free-tier (at the moment of writing)
* S3 (storage) and Cloudfront (CDN) on AWS, to take advantage of my existing account and the numerous tools and guides that already exist.
## Rough steps
1. [[Garden/Setup S3 bucket for use with Cloudfront\|Setup S3 bucket for use with Cloudfront]]
2. [[Garden/Setup custom AWS CloudFront CNAME\|Setup custom AWS CloudFront CNAME]]
3. [[Garden/Setup an IAM user to manage an S3 bucket\|Setup an IAM user to manage an S3 bucket]]
4. [[Garden/Manage S3 bucket with Cyberduck\|Manage S3 bucket with Cyberduck]]

	* This currently requires some manual work of uploading the file to S3 and linking to it from the note using the public Cloudfront URL.
	* The nice thing about this is that the bucket doesn't need to be public. In theory only one directory from the bucket could be published (the ones used for public notes), while the rest could remain private.
	 * One could create or extend an existing S3 plugin (e.g. https://github.com/jvsteiner/s3-image-uploader) with some cloudfront features.