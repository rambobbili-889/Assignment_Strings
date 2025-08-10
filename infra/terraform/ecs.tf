resource "aws_ecs_cluster" "api" {
  name = "${var.project}-${var.environment}-cluster"
}

resource "aws_iam_role" "task_execution" {
  name = "${var.project}-${var.environment}-task-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "ecs-tasks.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "task_execution" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_lb" "api" {
  name               = "${var.project}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = []
}

resource "aws_lb_target_group" "api" {
  name     = "${var.project}-${var.environment}-tg"
  port     = 4000
  protocol = "HTTP"
  vpc_id   = ""
  target_type = "ip"
  health_check {
    path = "/health"
  }
}

resource "aws_lb_listener" "api" {
  load_balancer_arn = aws_lb.api.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.project}-${var.environment}-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.task_execution.arn
  container_definitions = jsonencode([
    {
      name      = "api"
      image     = var.container_image
      essential = true
      portMappings = [{ containerPort = 4000, protocol = "tcp" }]
      environment = [
        { name = "PORT", value = "4000" },
        { name = "MONGO_URI", value = var.mongo_uri },
        { name = "JWT_SECRET", value = var.jwt_secret },
        { name = "JWT_REFRESH_SECRET", value = var.jwt_refresh_secret }
      ]
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "${var.project}-${var.environment}-api"
  cluster         = aws_ecs_cluster.api.id
  task_definition = aws_ecs_task_definition.api.arn
  launch_type     = "FARGATE"
  desired_count   = 1
  network_configuration {
    subnets         = []
    assign_public_ip = true
    security_groups = []
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 4000
  }
  depends_on = [aws_lb_listener.api]
}