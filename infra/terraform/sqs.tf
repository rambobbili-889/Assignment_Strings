resource "aws_sqs_queue" "simulations" {
  name = "${var.project}-${var.environment}-simulations"
  visibility_timeout_seconds = 30
  message_retention_seconds  = 345600
}