# Game Design Document: Junior Astronaut — Mars Voxel Outpost (NASA Data Edition)

## 1. Core Vision & NASA Scientific Datasets
- **Challenge Alignment:** Interactive 3D First-Person STEM Mars Outpost Simulation (Minecraft-inspired Voxel Sandbox + Survival) grounded in real NASA datasets (**MOLA** topography, **Mars Odyssey GRS** hydrogen maps, and **Curiosity RAD** radiation telemetry), focusing on hands-on astronaut survival and tangible engineering trade-offs.
- **Playable Region:** A `2048m × 2048m` (`±1024m` from crater center) voxel reconstruction of Jezero Crater (`18.38° N, 77.58° E`), with vertical height `CHUNK_HEIGHT = 128`.
- **Top-Right 5-Stage Mission Checklist HUD:** A persistent translucent checklist box fixed at the **Top-Right** of the Astronaut Helmet Visor HUD displays all 5 game stages (`Stage 1` to `Stage 5`), automatically marking completed stages with a green checkmark (`✓`) and highlighting active sub-objectives.
- **Lobby Logo Placement (`MainMenu.ts`):** Position `/media/after_earth_logo.jpg` (`mix-blend-mode: lighten`) in the **Top-Right corner** (`top: 24px; right: 28px;`) of the Lobby screen so the rotating Mars planet and starfield remain centered and unobstructed.
- **Guided Onboarding Tutorial (`TutorialManager.ts`):** A step-by-step interactive tutorial track with 3D waypoint beacons teaching movement, scanning (`F`/`Y`), mining (`RT`), modular building + Airlock sealing (`C`/`LT`), and Power Console triage (`P`) before unlocking the full resource-scarce missions.
- **Center-Screen Task Completion Attention Banner:** Every completed tutorial step, sub-objective, or mission stage triggers a centered HUD attention banner (`✓ OBJECTIVE COMPLETE`) with a sci-fi chime for `3.2s`.
- **Context-Triggered A.S.T.R.O. Presence:** A.S.T.R.O. remains in stealth/standby by default and flies in only during tutorial guidance, mission briefings, emergency hazard/low-vital alerts (`< 25%`), or when manually summoned (`G` / `D-Pad Up`) for `20s`.
- **Post-Tutorial Resource Distribution:** Beyond the tutorial, no Water Ice or rich Hematite spawns within `150m` of the landing zone; players must prospect distant sectors (`250m–750m` away) via the 3D GRS Globe (`M`) and Pressurized Rover (`E`/`X`).
- **Extended NASA PDS Instrument Suite (11 Total NASA Sources):**
  - **MOLA (MGS):** Global & Jezero Crater elevation and landing slope (`< 5°` safe vs. `> 15°` steep).
  - **HiRISE (MRO):** High-resolution surface boulder/hazard density overlay during 3D Globe landing selection (Level 1).
  - **CRISM (MRO):** Orbital mineral spectroscopy layer on the 3D Globe (`M`) highlighting Hematite Iron Ore veins and hydrated clay zones (Levels 2–3).
  - **Mars Odyssey GRS & SHARAD (MRO):** Orbital hydrogen mapping (`1m` depth) paired with the Rover's `SHARAD` deep subsurface radar profiler (`R`/`Y`, up to `1km` depth) in Level 3.
  - **Curiosity RAD:** Live surface radiation telemetry (`0.67 mSv/day` baseline + Solar Particle Event spikes) in Level 5.
  - **MEDA (Perseverance):** Live Martian air temperature (`°C`), wind speed (`m/s`), and **Dust Optical Depth (`Tau τ`)** driving solar attenuation in Level 4.
  - **THEMIS (Mars Odyssey):** Infrared thermal-inertia vision mode inside the Geological Scanner (`F`/`Y`) to spot cold subsurface ice veins at night.
  - **SEIS (InSight):** Marsquake seismic event alert requiring Airlock seal verification (`Right Click`/`LT`).
  - **MOXIE (Perseverance) & MECA/SAM (Phoenix/Curiosity):** $CO_2$-to-$O_2$ electrolysis and perchlorate soil remediation.

## 2. Standard Block, Building & Machine Registry (IDs 0–17)
- `0`: Air
- `1`: Martian Regolith Top (mineable surface soil; toxic perchlorates must be washed/enriched before Greenhouse farming)
- `2`: Sub-regolith Soil (mineable)
- `3`: Martian Dust Sand (basin & delta sediment)
- `4`: Dark Basalt Stone (bedrock & crater rim rock)
- `5`: 3D-Printed Regolith Brick (structural block for **Habitat** & **Radiation Shelter** thick shielding layers)
- `6`: Subsurface Water Ice (buried in confirmed GRS ice reservoirs; mined manually by hand)
- `7`: Hematite Iron Ore (mined along crater slopes for advanced facilities & Rover)
- `8`: Solar Farm Panel (`+10 kW` day, `0 kW` night, `+3 kW` dust storm; accumulates dust requiring manual EVA brushing via `Right-Click`)
- `9`: Oxygen Generator / MOXIE (`-4 kW` -> `+2.5 O2/s` from Martian $CO_2$)
- `10`: Water Processing Unit (`-5 kW` -> melts mined Water Ice into `H2O` and extracts `+2.0 H2O/s` & `+1.5 O2/s` when placed over confirmed Ice)
- `11`: Reinforced Viewport Glass (transparent; lets natural sunlight into **Greenhouse** / **Habitat**)
- `12`: Battery Storage Bank (stores surplus solar energy for night cycles & dust storms; discharges up to `+15 kW` when solar drops)
- `13`: Greenhouse Crop Bed (manually planted on Enriched Soil inside pressurized Greenhouse/Habitat; grows across 3 visual stages and manually harvested for Food, Seeds, and Bio-Compost)
- `14`: Airlock Door (manually cycled via `Right-Click` to seal enclosed voxel rooms into pressurized **Habitat** / **Radiation Shelter**)
- `15`: MDV Lander Metal Hull (landing craft; acts as emergency starter ice melter & `O2` refill)
- `16`: Enriched Martian Soil (manually crafted from `2 Raw Regolith` + `10 H2O` + `1 Bio-Compost` for Greenhouse farming)
- `17`: Research Lab Terminal (`-5 kW` -> analyzes **Mars Odyssey GRS** Rover samples, **Curiosity RAD** telemetry, and bonus geological anomalies)

## 3. The 5 Game Stages & Engineering Trade-offs

### Stage 1: The Landing – الهبوط على المريخ
- **Objective:** Land safely and select a viable outpost site on the **Orbital MOLA Topography Map**.
- **Challenges & NASA Data:** Using **NASA MOLA** elevation and slope data, players inspect terrain steepness, flat buildable area, and proximity to resource zones.
- **Player Trade-off:** Choosing a safe, flat plain guarantees an undamaged landing and easy building, but sits farther from water-ice/ore zones; choosing rugged terrain near resource deposits risks landing hull/battery damage on steep slopes.

### Stage 2: Build Your Base – بناء القاعدة
- **Objective:** Construct a livable, functional outpost and balance power distribution.
- **Core Base Facilities:**
  1. **Habitat & Radiation Shelter:** Enclosed pressurized room built with `3D-Printed Regolith Bricks (ID: 5)` + `Airlock Door (ID: 14)` (optionally with `Glass ID: 11` viewports).
  2. **Solar Farm (`ID: 8`) & Battery Bank (`ID: 12`):** Primary power generation and storage.
  3. **Oxygen Generator (`ID: 9`):** Life-support $O_2$ production.
  4. **Water Processing Unit (`ID: 10`):** Water purification and ice melting.
  5. **Greenhouse (`ID: 16` + `ID: 13`):** Enriched Martian soil farming for sustainable Food.
  6. **Research Lab (`ID: 17`):** Sample analysis and planetary science station.
- **Challenges & Trade-off:** Initial Solar Farm output cannot run every facility simultaneously. Players open the **Outpost Power Console (`P`)** to prioritize critical life support (`Oxygen Generator` & `Water Processing`) over secondary systems (`Research Lab` & `Greenhouse` LEDs).

### Stage 3: The Water Mystery – البحث عن المياه
- **Objective:** Locate and confirm an extractable subsurface water-ice reservoir.
- **Gameplay & NASA Data:** Players open the **Mars Odyssey GRS Hydrogen Map (`M` key)** showing broad regional hydrogen signatures across 3 candidate sectors (`Sector Alpha`, `Sector Beta`, `Sector Gamma`). Players drive the **Pressurized Rover (`E`)** to candidate zones, run subsurface drill scans (`R`), and analyze results at the **Research Lab (`ID: 17`)**.
- **Challenges & Trade-off:** Because **Mars Odyssey GRS** maps hydrogen broadly rather than proving ice at a single point, some candidate zones yield only bound hydrated minerals (false positives) while draining Rover/Suit power. Players must decide whether to invest in extracting water at a confirmed deposit or keep exploring before `H2O` runs out.

### Stage 4: Dust Storm – العاصفة الترابية (Emergency Challenge)
- **Objective:** Keep the crew and life-support systems alive through a severe Martian dust storm.
- **Trigger & Challenges:** Displays the flashing HUD alert **`WARNING: Severe Dust Storm Approaching!`** (`45s` early warning countdown). Solar Farm generation plummets by `70%`, dust coats panels (requiring manual EVA brushing), Battery Bank reserves drain rapidly, and outdoor Rover visibility/speed drops.
- **Player Trade-off:** Halt outdoor EVAs and use the **Power Console (`P`)** to temporarily shut down the **Research Lab** and **Greenhouse** so stored battery power preserves **Oxygen** and **Water** until the storm clears.

### Stage 5: Radiation Threat – خطر الإشعاع
- **Objective:** Protect the crew during an elevated radiation event and manage EVA exposure risk.
- **Gameplay & NASA Data:** Displays live surface radiation telemetry modeled on **Curiosity RAD** measurements from Gale Crater (explicitly noted in HUD/Field Cards as local surface time-series data rather than a global map). During a Solar Particle Event, radiation levels spike sharply.
- **Challenges & Trade-off:** Players must thicken **Radiation Shelter / Habitat** walls/roofs with extra `3D-Printed Regolith Bricks (ID: 5)` (`>= 85%` shielding) and decide whether to stay outside briefly to finish scanning a high-value scientific anomaly while `Radiation Dose` climbs, or retreat inside shelter immediately.

## 4. Mission Success & Failure States (Engineering Debrief)
- **Auto-Checkpoint System:** Saves a state snapshot at the start of every stage so players can retry failed engineering decisions without losing earlier progress.
- **Failure Triggers:** `Suit O2 = 0%` (after A.S.T.R.O.'s single emergency canister is used), `Radiation Dose = 100%`, `Suit H2O = 0%`, or `Food = 0%`.
- **Debrief Modals:** Displays a **NASA Field Card** upon stage completion (`Tab` to review anytime) or an **Engineering Root-Cause Failure Analysis** modal upon failure with **"Retry Stage Checkpoint"** and **"New Landing Site"** buttons.

## 5. Companion Robot: A.S.T.R.O. (Proactive NASA Advisor & Scout Drone)
- **Visual Design:** A compact hovering cubic voxel drone (`0.6m` scale) modeled after NASA's *Astrobee*, featuring a white/blue NASA hull, animated glowing cyan/amber/red pixel eyes, side thruster pods, a bottom gripper arm, and a forward LED spotlight.
- **Proactive Advisory & Consequence Warning System:**
  1. **Pre-Stage Briefings:** At the start of each of the 5 stages, A.S.T.R.O. delivers an engineering briefing in the HUD Comms Box highlighting the NASA science context and key resource trade-offs.
  2. **Disaster & Consequence Alerts:** Triggers red pulsing alerts with synthesized audio chimes 45 seconds before Dust Storms and Radiation Spikes, explicitly stating the engineering consequence if unmitigated (e.g., battery blackout cutting off O2 generation, or acute radiation exposure reaching 100%).
  3. **Low-Stock & Vital Depletion Warnings:** Monitors Suit `O2`, `H2O`, `Food`, Outpost `Battery %`, and key crafting materials; warns when any vital drops below `25%`, explains the survival consequence (Hypoxia, Dehydration, Starvation, Life-Support Shutdown), and recommends the exact corrective action.
- **Commands (`G` Key):**
  1. `Follow & Illuminate`: Hovers beside the astronaut, casts a spotlight at night/storms, and points a targeting laser toward scanned Ice/Ore veins (`F`).
  2. `Scout & Alert`: Patrols the outpost to inspect Solar Panels for dust buildup and Greenhouse crops for harvest readiness, hovering above any panel/crop needing astronaut attention (keeping hands-on tasks with the player).
  3. `Dock & Recharge`: Returns to base to recharge its internal battery (`-2 kW` load on the Outpost Power Grid, toggleable in the `P` Power Console).
- **Emergency Lifesaver:** Carries 1 emergency `O2` charge that automatically refills `40%` Suit Oxygen if the player hits `0% O2` outdoors (recharged at base).

## 6. Controls & HUD
- `WASD`: Move (`0.38g` Mars gravity) | `Space`: Jump | `Shift`: Sprint
- `Left Click`: Mine block | `Right Click`: Place block, brush dust off Solar Panels, melt Ice, plant/harvest Greenhouse crops, cycle Airlock, or use Research Lab
- `M`: Open **Mars Odyssey GRS** Hydrogen Exploration Map
- `F`: Geological Scanner pulse (reveals subsurface Ice & Ore)
- `G`: Cycle **A.S.T.R.O.** drone mode (`Follow`, `Scout/Alert`, `Recharge`)
- `P`: Open Outpost Power Distribution Console
- `C`: Crafting, Soil Remediation & Ice Melting Menu
- `E`: Enter / Exit Pressurized Mars Rover
- `Tab`: Open NASA Science Codex & Field Cards
- `1-9`: Select Hotbar slot