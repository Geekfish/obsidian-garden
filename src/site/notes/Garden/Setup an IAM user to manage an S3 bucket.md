---
{"dg-publish":true,"permalink":"/garden/setup-an-iam-user-to-manage-an-s3-bucket/","tags":["aws","how-to"],"created":"2024-03-05T18:07:23.783+01:00","updated":"2024-03-05T18:35:49.059+01:00"}
---

We can create an IAM user that only has permissions to manage a desired bucket, e.g. `S3-blog-assets-manager`.

The most basic permissions would be to just list and manage objects in the entire bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:List*",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::blog-assets.example.com",
                "arn:aws:s3:::blog-assets.example.com/*"
            ]
        }
    ]
}
```

> [!info] More Permissions
> Permission to list buckets may also be useful in some cases (e.g. if needed for an integration that's bucket-name agnostic).
