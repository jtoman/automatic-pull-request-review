"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const token = core.getInput('repo-token');
const requestEvent = core.getInput('event');
const body = core.getInput('body');
const octokit = new github.GitHub(token);
if ((requestEvent === 'COMMENT' || requestEvent === 'REQUEST_CHANGES') &&
    !body) {
    core.setFailed('Event type COMMENT & REQUEST_CHANGES require a body.');
}
const pullRequest = github.context.payload['pull_request'];
if (!pullRequest) {
    core.setFailed('This action is meant to be ran on pull requests');
}
if (requestEvent === 'DISMISS') {
    octokit
        .graphql(`
      mutation {
        addPullRequestReview(input: {
          pullRequestId: "${pullRequest['node_id']}",
          event: ${requestEvent},
        }) {clientMutationId} }`)
        .catch((err) => {
        core.error(err);
        core.setFailed(err.message);
    });
}
else {
    octokit
        .graphql(`
      mutation {
        addPullRequestReview(input: {
          pullRequestId: "${pullRequest['node_id']}",
          event: ${requestEvent},
          body: "${body}"
        }) {clientMutationId} }`)
        .catch((err) => {
        core.error(err);
        core.setFailed(err.message);
    });
}
