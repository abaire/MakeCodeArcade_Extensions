FROM node:20-slim

# 1. Install system build tools required for native Node modules during initialization
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2. Install the core MakeCode CLI (not the web editor)
RUN npm install -g pxt

# 3. Cache the Arcade target in the container's environment layer.
# By doing this one level above the workspace, pxt will resolve dependencies
# from the container, keeping node_modules completely off your host machine.
WORKDIR /arcade-env
RUN pxt target arcade

# 4. Set the working directory where your host volume will be mounted
WORKDIR /arcade-env/workspace