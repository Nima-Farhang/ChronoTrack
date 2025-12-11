# Dev container Dockerfile for Codespaces
# Alpine-based devcontainer with Node.js, npm, AWS CLI v2, Docker CLI, Terraform

FROM mcr.microsoft.com/devcontainers/base:alpine

# Install base dependencies + Node.js + npm
RUN apk update && apk add --no-cache \
    bash \
    curl \
    unzip \
    gnupg \
    ca-certificates \
    docker-cli \
    nodejs \
    npm \
    && update-ca-certificates \
    \
    # Install AWS CLI v2
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" \
    && unzip /tmp/awscliv2.zip -d /tmp \
    && /tmp/aws/install \
    && rm -rf /tmp/aws /tmp/awscliv2.zip \
    \
    # Install Terraform
    && T_VERSION="1.9.6" \
    && curl -fsSL "https://releases.hashicorp.com/terraform/${T_VERSION}/terraform_${T_VERSION}_linux_amd64.zip" -o /tmp/terraform.zip \
    && unzip /tmp/terraform.zip -d /usr/local/bin \
    && rm -f /tmp/terraform.zip \
    && chmod +x /usr/local/bin/terraform \
    \
    # Install global Node.js tooling for TypeScript dev
    && npm install -g typescript ts-node

# Copy AWS CLI SSO configuration script (run at container start, not build)
COPY .devcontainer/aws-configure.sh /usr/local/bin/aws-configure.sh
RUN chmod +x /usr/local/bin/aws-configure.sh


# Add alias for root directory (for interactive shells)
RUN echo "alias root='cd /workspaces/WorkBench'" >> /etc/profile

# Default command: run AWS config script, then drop into bash
CMD ["/bin/bash", "-c", "source /usr/local/bin/aws-configure.sh && exec bash"]