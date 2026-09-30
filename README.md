# production-cluster-mark

Makes it obvious at all times that you are working in a production cluster, so you are less likely to change the wrong environment.

## Features

While the selected tab belongs to a production cluster, a red edge runs around the whole Lens window. It draws over nothing you need, and clicks go straight through it.

Switch to a staging cluster, or to a tab that is not a cluster, and the edge disappears.

## Which clusters count as production

- **By name, automatically:** a cluster whose name contains `prod`, `production` or `prd` as a separate word, such as `prod-eu`, `k8s_production` or `prd01`. Names like `preprod` or `nonprod` do not count.
- **By hand:** right-click a cluster in the navigator and choose **Mark as production** or **Unmark as production**. From the command palette, **Production Cluster Mark: Mark this cluster as production** toggles the cluster you are looking at. Your choice overrides the name rule and is remembered across restarts.

## Development

1. `npm install`
2. `npm run build` after every change under `src/`

What changed in each version is in [CHANGELOG.md](./CHANGELOG.md).
