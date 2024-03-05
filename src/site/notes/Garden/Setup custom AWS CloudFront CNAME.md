---
{"dg-publish":true,"permalink":"/garden/setup-custom-aws-cloud-front-cname/","tags":["aws","how-to"],"created":"2024-03-03T14:24:35.592+01:00","updated":"2024-03-05T19:13:25.857+01:00"}
---

# Setup custom AWS CloudFront CNAME

Part of: [[Garden/Hosting assets on S3 + Cloudfront\|Hosting assets on S3 + Cloudfront]]]

AWS CloudFront distributions provide a random subdomain (e.g. `a2cc2124adda.cloudfront.net`), which comes with an SSL certificate.
If we want to use a custom domain name, we have to also setup an SSL certificate.

Here's the summary to save the trips to the various guides scattered around AWS docs.

Assuming we want to point an AWS CloudFront to use `assets.example.com`: 

1. On [AWS Certificate Manager (ACM)](https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/welcome) 
	* Create a new public certificate
	* NB: The region **must be** US-East N. Virginia!
	* You can also get it from somewhere else and import it
2. On the DNS provider:
	* Add verification CNAME
	* Add CNAME and pointing from domain to distribution domain, e.g. `assets.example.com -> a2cc2124adda.cloudfront.net`
3. Ensure it all works:
```sh
> dig assets.example.com
# ....
assets.example.com.	13104	IN	CNAME	a2cc2124adda.cloudfront.net.
# a2cc2124adda.cloudfront.net. 54 IN	A	3.162.78.124
# ....
```
4. On [AWS CloudFront](https://us-east-1.console.aws.amazon.com/cloudfront/v4/home#/distributions)
	* Find the distribution
	* `Settings -> Edit`
	* Set up the CNAME from the previous step, i.e. `assets.example.com`
	* Set up the certificate created above
5. Done 🍰