resource "aws_s3_bucket" "media" {
  bucket = var.s3_bucket_name != "" ? var.s3_bucket_name : "${var.project}-${var.environment}-media"
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}