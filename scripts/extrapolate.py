import math
import json

# Your input data
data = json.loads(open('scripts/data2.json', 'r').read())

print(data)
# Build a set of existing undirected edges for quick lookup
existing_edges = set()
for edge in data["edges"]:
    a, b = edge["node1id"], edge["node2id"]
    existing_edges.add(frozenset([a, b]))

# New edges to be added
new_edges = []
next_edge_id = 0
if len(data['edges']):
    next_edge_id = max(edge["id"] for edge in data["edges"]) + 1

# Pairwise distance check
for i in range(len(data["nodes"])):
    for j in range(i + 1, len(data["nodes"])):
        n1, n2 = data["nodes"][i], data["nodes"][j]
        dx = n1["x"] - n2["x"]
        dy = n1["y"] - n2["y"]
        dist = math.hypot(dx, dy)
        if dist <= 10 and frozenset([n1["id"], n2["id"]]) not in existing_edges:
            new_edges.append({
                "node1id": n1["id"],
                "node2id": n2["id"],
                "id": next_edge_id
            })
            next_edge_id += 1

# Add new edges to the original data
data["edges"].extend(new_edges)

# Output the updated data
with open('extrapolated.json', 'w') as f:
    f.write(json.dumps(data, indent=2))