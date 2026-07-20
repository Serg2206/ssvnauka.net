#!/usr/bin/env bash
set -euo pipefail

CANONICAL_HOST="${1:-ssvnauka.com}"

if [[ "$CANONICAL_HOST" != "ssvnauka.com" && "$CANONICAL_HOST" != "www.ssvnauka.com" ]]; then
  echo "Usage: $0 [ssvnauka.com|www.ssvnauka.com]"
  exit 1
fi

ALT_HOST="www.ssvnauka.com"
if [[ "$CANONICAL_HOST" == "www.ssvnauka.com" ]]; then
  ALT_HOST="ssvnauka.com"
fi

echo "[info] canonical host: $CANONICAL_HOST"
echo "[info] alternate host: $ALT_HOST"
echo

FAILURES=0

pass() {
  echo "[pass] $1"
}

fail() {
  echo "[fail] $1"
  FAILURES=$((FAILURES + 1))
}

check_redirect_to_canonical() {
  local source_host="$1"
  local expected_location="https://${CANONICAL_HOST}/"

  local headers
  headers="$(curl -sSI "https://${source_host}/")"

  local status
  status="$(printf '%s\n' "$headers" | head -n 1 | awk '{print $2}')"

  local location
  location="$(printf '%s\n' "$headers" | awk 'tolower($1)=="location:" {print $2}' | tr -d '\r' | head -n 1)"

  if [[ "$source_host" == "$CANONICAL_HOST" ]]; then
    if [[ "$status" == "200" || "$status" == "304" ]]; then
      pass "canonical host ${source_host} returns ${status}"
    else
      fail "canonical host ${source_host} unexpected status: ${status}"
    fi
    return
  fi

  if [[ "$status" =~ ^30[1278]$ && "$location" == "$expected_location" ]]; then
    pass "${source_host} redirects to ${expected_location} (${status})"
  else
    fail "${source_host} redirect mismatch: status=${status} location=${location:-<none>}"
  fi
}

check_seo_host_in_body() {
  local host="$1"
  local path="$2"
  local expected_url_prefix="https://${CANONICAL_HOST}/"

  local body
  body="$(curl -sL "https://${host}${path}")"

  if printf '%s' "$body" | grep -q "$expected_url_prefix"; then
    pass "${host}${path} contains canonical prefix ${expected_url_prefix}"
  else
    fail "${host}${path} does not contain canonical prefix ${expected_url_prefix}"
  fi
}

check_redirect_to_canonical "ssvnauka.com"
check_redirect_to_canonical "www.ssvnauka.com"
check_redirect_to_canonical "ssvnauka.net"

echo
check_seo_host_in_body "$CANONICAL_HOST" "/robots.txt"
check_seo_host_in_body "$CANONICAL_HOST" "/sitemap.xml"

echo
if [[ "$ALT_HOST" != "$CANONICAL_HOST" ]]; then
  check_redirect_to_canonical "$ALT_HOST"
fi

echo
if [[ $FAILURES -gt 0 ]]; then
  echo "[summary] ${FAILURES} check(s) failed"
  exit 1
fi

echo "[summary] all checks passed"
