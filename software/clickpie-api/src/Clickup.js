import {
  Http,
  CLICKUP_API_PREFIX,
  CLICKUP_LOGIN_USERNAME,
  CLICKUP_LOGIN_TOKEN,
  CLICKPIE_SERVER_URL_PREFIX,
} from "clickpie-commons";

class Clickup extends Http {
  constructor({ url, authToken, username } = {}) {
    super({
      url: url || CLICKUP_API_PREFIX,
      authToken: authToken || CLICKUP_LOGIN_TOKEN,
      username: username || CLICKUP_LOGIN_USERNAME,
    });
  }

  getWorkspaces() {
    return this.get("/team").then((res) =>
      res.teams.map((team) => ({
        type: "workspace",
        id: team.id,
        name: team.name,
        color: team.color,
      })),
    );
  }

  createHook({ name, events, spaceId, folderId, listId, taskId}) {
    log.info(`Create webhook: ${CLICKPIE_SERVER_URL_PREFIX}/${name}`);
  }

}

export { Clickup };
