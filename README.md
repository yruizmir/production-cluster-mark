# production-cluster-mark

Makes it obvious at all times that you are working in a production cluster, so you are less likely to change the wrong environment.

## How to use it

1. **Mark your production clusters.** Right-click a cluster in the navigator on the left and choose **Mark as production**. Clusters whose name contains `prod`, `production` or `prd` are marked for you already.
2. **Open the cluster.** While its tab is selected, Lens is marked: by default a red edge around the window, a PRODUCTION label in the top bar and the status bar, and a PRODUCTION row under the cluster in the navigator.
3. **Make it yours.** Open **Preferences → Extensions → production-cluster-mark** to choose which marks to show, in which colour, and how thick.

![The production-cluster-mark preferences: one row per mark, numbered 1 to 5 like the marks in the window, each with a checkbox, a colour and, for the window edge and the top strip, a thickness](https://raw.githubusercontent.com/yruizmir/production-cluster-mark/main/assets/preferences.png)

## Marking and unmarking a cluster

- **Right-click a cluster** in the navigator and choose **Mark as production** or **Unmark as production**.
- **From the command palette:** **Production Cluster Mark: Mark this cluster as production** (or **Unmark**) toggles the cluster you are looking at.
- **By name, automatically:** a cluster whose name contains `prod`, `production` or `prd` as a separate word, such as `prod-eu`, `k8s_production` or `prd01`, counts as production. Names like `preprod` or `nonprod` do not.

Marking or unmarking by hand overrides the name rule, and is remembered across restarts.

## The marks

In **Preferences → Extensions → production-cluster-mark**, each mark can be turned on or off and given a colour of its own (red, orange, yellow, magenta, purple, or any colour you like):

![A Lens window with a production cluster open and its five marks numbered: 1 the window edge, 2 the top strip, 3 the top bar label, 4 the status bar label, 5 the navigator row](https://raw.githubusercontent.com/yruizmir/production-cluster-mark/main/assets/marks.png)

1. **Window edge:** an edge around the whole window. On by default.
2. **Top strip:** a strip along the top of the window, over the top bar.
3. **Top bar label:** PRODUCTION and the cluster's name, in the top bar. On by default.
4. **Status bar label:** the same label in the status bar at the bottom. On by default.
5. **Navigator row:** a PRODUCTION row first under each production cluster in the navigator, even when it is not the cluster you have open. On by default.

The window edge and the top strip each have a thickness of their own too: thin, medium or thick. The marks draw over nothing you need, and clicks go straight through them. Switch to a cluster that is not production, or to a tab that is not a cluster, and they disappear.

## Development

1. `npm install`
2. `npm run build` after every change under `src/`

What changed in each version is in [CHANGELOG.md](./CHANGELOG.md).
