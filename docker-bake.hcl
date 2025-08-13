// Define variables
variable "TAG" {
  default = "latest"
}

// Common build arguments for all services
function "args" {
  params = []
  result = {
    "backend" = {
      context = "./backend"
      dockerfile = "Dockerfile"
      tags = ["backend:${TAG}"]
    }
    "frontend" = {
      context = "./frontend"
      dockerfile = "Dockerfile"
      tags = ["frontend:${TAG}"]
    }
  }
}

// Define build targets
target "backend" {
  dockerfile = args["backend"].dockerfile
  context = args["backend"].context
  tags = args["backend"].tags
  platforms = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=registry,ref=backend:cache"]
  cache-to = ["type=inline"]
}

target "frontend" {
  dockerfile = args["frontend"].dockerfile
  context = args["frontend"].context
  tags = args["frontend"].tags
  platforms = ["linux/amd64", "linux/arm64"]
  cache-from = ["type=registry,ref=frontend:cache"]
  cache-to = ["type=inline"]
}

// Group targets
group "default" {
  targets = ["backend", "frontend"]
}
