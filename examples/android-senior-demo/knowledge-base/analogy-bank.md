# Analogy Bank (FICTIONAL DEMO)

### Player pool
- **Analogy**: Like a car-rental counter that keeps engines warm — instead of building a new car every time a customer arrives, you hand them a ready, idling one and refuel it after.
- **Mapping**: warm car = pre-initialized player; counter = pool; refuel = reset/rebind for the next item.

### Crash monitoring loop
- **Analogy**: Like a hospital triage board — you don't treat patients in arrival order, you sort by severity (Top-N crash signatures) and treat the deadliest first.
- **Mapping**: triage board = crash aggregation; severity = crash frequency × impact.

### Vsync / frame budget
- **Analogy**: Like a conveyor belt at sushi — a plate must be ready every 16ms or the belt slot goes by empty (dropped frame).
- **Mapping**: belt tick = vsync; empty slot = jank; chef prep time = frame work budget.
