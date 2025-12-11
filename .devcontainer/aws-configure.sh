#!/bin/bash
set -e

ENV_FILE="/workspaces/CICD-Container/.env"

AWS_CREDENTIALS_FILE="${HOME}/.aws/credentials"
mkdir -p "$(dirname "$AWS_CREDENTIALS_FILE")"

cat > "$AWS_CREDENTIALS_FILE" <<EOF
[${SSO_ACCOUNT_ID}_AdministratorAccess]
aws_access_key_id=${AWS_ACCESS_KEY_ID}
aws_secret_access_key=${AWS_SECRET_ACCESS_KEY}
aws_session_token=${AWS_SESSION_TOKEN}
EOF

echo "AWS CLI credentials for account '${SSO_ACCOUNT_ID}' configured at ${AWS_CREDENTIALS_FILE}."
cat $AWS_CREDENTIALS_FILE


AWS_CONFIG_FILE="${HOME}/.aws/config"
mkdir -p "$(dirname "$AWS_CONFIG_FILE")"

cat > "$AWS_CONFIG_FILE" <<EOF
[profile ${PROFILE_NAME}]
sso_session = Terraform
sso_account_id = ${SSO_ACCOUNT_ID}
sso_role_name = AdministratorAccess
region = ap-southeast-2
output = json

[sso-session Terraform]
sso_start_url = ${SSO_START_URL}
sso_region = us-east-1
sso_registration_scopes = sso:account:access
EOF

echo "AWS CLI SSO profile '${PROFILE_NAME}' and session 'Terraform' configured at ${AWS_CONFIG_FILE}."

cat $AWS_CONFIG_FILE