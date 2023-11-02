import {
  Http,
  CLICKUP_API_PREFIX,
  CLICKUP_LOGIN_USERNAME,
  CLICKUP_LOGIN_TOKEN,
} from "clickpie-commons";
import { Graph } from 'clickpie-commons';

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

  constructGraph() {
    const g = new Graph({
      type: 'account',
      id: this.username,
    });
    g.traverse(this.root, (vertex, stop) => {

    })
  }
}

export { Clickup };
