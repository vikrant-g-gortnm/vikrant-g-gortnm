import moment from "moment";

export default function applyFilters({ connections, filters }) {
  // Check if we have all the vals:
  filters = filters || {};
  filters.dateRange = filters.dateRange || [null, null];

  if (!filters) return connections;

  if (filters.starred) {
    connections = connections.filter(connection => {
      if (!connection) return false;
      return connection.starred;
    });
  }

  if (filters.search && filters.search.length !== 0) {
    let firstTwo = filters.search.slice(0, 2);

    if (firstTwo === ":f") {
      let [, funnelName] = filters.search.split(" ");

      if (!funnelName) {
        connections = connections.filter(({ funnelTags }) => funnelTags.length);
      }

      if (funnelName) {
        connections = connections.filter(({ funnelTags }) => {
          let containsTag = funnelTags.find(({ name }) =>
            name.toLowerCase().includes((funnelName || "").toLowerCase())
          );

          if (!containsTag) return false;

          if (containsTag) {
            let highest = funnelTags.reduce(
              (max, tag) => (tag.index > max ? tag.index : max),
              funnelTags[0].index
            );
            return containsTag.index >= highest;
          }
          return false;
        });
      }
    }

    if (firstTwo === ":t") {
      let [, tagName] = filters.search.split(" ");
      connections = connections.filter(({ tags }) =>
        tags.some(({ name }) =>
          name.toLowerCase().includes((tagName || "").toLowerCase())
        )
      );
    }

    if (firstTwo !== ":f" && firstTwo !== ":t") {
      let search = filters.search.toLowerCase();
      connections = connections.filter(({ creative }) =>
        creative.name.toLowerCase().includes(search)
      );
    }
    let search = filters.search.toLowerCase();
    connections = connections.filter(({ creative }) =>
      creative.name.toLowerCase().includes(search)
    );
  }

  if (filters.tags?.length) {
    connections = connections.filter(({ tags }) =>
      filters.tags.every(ft => tags.map(({ id }) => id).includes(ft.id))
    );
  }

  if (filters.funnelTags?.length) {
    connections = connections.filter(({ funnelTags }) => {
      if (!funnelTags.length) return false;

      let highest = funnelTags.reduce(
        (max, tag) => (tag.index > max ? tag.index : max),
        funnelTags[0].index
      );
      let tag = funnelTags.find(({ index }) => index === highest);

      return filters.funnelTags.some(({ id }) => id === tag.id);
    });
  }

  if (filters.dateRange[0] || filters.dateRange[1]) {
    const [start, end] = [
      filters.dateRange[0] ? moment(filters.dateRange[0]).valueOf() : null,
      filters.dateRange[1] ? moment(filters.dateRange[1]).valueOf() : null,
    ];
    connections = connections.filter(
      connection =>
        (start ? start <= connection.updatedAt : true) &&
        (end ? end >= connection.updatedAt : true)
    );
  }

  return connections;
}
