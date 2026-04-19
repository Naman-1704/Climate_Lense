"""
seed.py — Populates the database with sample climate news articles on first run.
"""

from sqlalchemy.orm import Session
import models


ARTICLES = [
    {
        "title": "Kerala Monsoon Floods Displace Over 50,000 Residents",
        "category": "flood",
        "impact": "high",
        "description": "Unprecedented rainfall triggers massive flooding across three districts, forcing tens of thousands from their homes and disrupting critical infrastructure.",
        "body": "The state of Kerala witnessed its most severe monsoon flooding in recent memory, with over 50,000 residents forced to evacuate across Wayanad, Idukki, and Pathanamthitta districts. Continuous heavy rainfall over 72 hours caused rivers to breach their banks, inundating hundreds of villages. The flooding destroyed roads, bridges, and disrupted electricity and clean water supplies to thousands of homes. The National Disaster Response Force deployed 45 teams while the Indian Air Force carried out airlifts of stranded villagers. Crop losses across the region are estimated at over ₹800 crore.",
        "env_impact": "The flooding caused severe soil erosion across highland regions, washing away topsoil built over centuries. Riverine ecosystems have been disrupted, with fish populations and aquatic biodiversity severely impacted. Floodwaters carrying agricultural chemicals and sewage contaminated freshwater sources, posing long-term water quality challenges. The event also accelerated the breakdown of natural flood barriers due to prior deforestation in the Western Ghats. At least three wildlife corridors were temporarily submerged, forcing dangerous migrations of elephants and other megafauna into human settlements.",
        "ethics": "This disaster raises profound questions about accountability. Years of unregulated construction in ecologically sensitive Western Ghats zones — often approved despite expert warnings — directly amplified flood severity. The burden falls disproportionately on low-income communities and adivasi populations who had the least role in creating these conditions. Governments face scrutiny for approving development in fragile ecosystems. Environmental justice demands that those responsible for deforestation and illegal construction bear the costs of recovery, not the communities already living on the margins.",
        "actions": "Implement strict no-construction zones in the Western Ghats ecological hotspot\nRestore riparian vegetation buffers along all major rivers\nDevelop community-based early warning systems in vulnerable districts\nCompensate displaced communities with sustainable resettlement housing\nAudit all construction permits granted in flood-prone zones since 2010\nInvest in wetland restoration as natural flood buffers",
        "emoji": "🌊",
        "color": "#0d1f2d",
        "featured": True,
    },
    {
        "title": "Delhi Records Highest Ever May Temperature at 49.2°C",
        "category": "heatwave",
        "impact": "high",
        "description": "India's capital shatters all temperature records as a deadly heatwave grips North India, causing heat-related illnesses and straining the power grid to its limits.",
        "body": "Delhi's temperature soared to 49.2°C on May 22nd, breaking all previous records and triggering a public health emergency. Hospitals reported over 400 cases of heat stroke and heat exhaustion within 48 hours. The power grid faced unprecedented demand as air conditioner usage surged, leading to extended outages in outer districts. Schools were shut across NCR, outdoor construction was halted by court order, and emergency water kiosks were deployed across the city. Meteorologists confirmed this was a direct signature event of accelerating climate change in the Indian subcontinent.",
        "env_impact": "The extreme heat event is a direct manifestation of the urban heat island effect amplified by global climate change. The concentration of concrete, reduced green cover, and vehicle emissions in Delhi creates a feedback loop that intensifies heatwaves. The event caused mass mortality of street animals and birds — ornithologists reported thousands of bird deaths across the NCR. Agricultural impact extends to surrounding regions, with standing wheat crops wilting, impacting food security. The heatwave also accelerated Himalayan glacial melt, contributing to long-term water stress in the entire Gangetic basin.",
        "ethics": "The poorest urban residents — daily wage workers, street vendors, construction workers — had no choice but to work in lethal heat, raising critical questions about labor rights and climate justice. Wealthy households retreated to air conditioning, which itself contributes to outdoor temperature rise. This heatwave exposes a profound inequality: those least responsible for carbon emissions suffer the most. Government inaction on urban greening plans and delayed issuance of official heatwave warnings constitute a measurable failure of the duty of care.",
        "actions": "Mandate cool roof programs on all new urban construction\nEstablish legally protected paid heat emergency leave for outdoor workers\nExpand green corridors with 1 million urban tree plantation targets\nDevelop air-conditioned public cooling centers in every ward\nAccelerate coal-to-renewable transition to reduce urban emission heat load\nCreate shaded water stations as permanent urban infrastructure",
        "emoji": "🔥",
        "color": "#2d0d0d",
        "featured": False,
    },
    {
        "title": "Mumbai Air Quality Hits 'Severe' for 8 Consecutive Days",
        "category": "pollution",
        "impact": "med",
        "description": "Construction dust, vehicle emissions, and crop burning combine to push Mumbai's AQI into dangerous territory for over a week, triggering school closures and health emergencies.",
        "body": "Mumbai's Air Quality Index remained in the 'Severe' category (above 400) for eight consecutive days in early January, prompting health advisories, school closures, and restrictions on construction activity. PM2.5 levels reached 15 times the WHO safe limit during peak hours. Respiratory emergency visits at hospitals increased by 40% compared to the same period in the previous year. The BMC activated its Graded Response Action Plan, halting diesel generator use and restricting heavy vehicle entry. Citizens across the city reported burning eyes, persistent coughs, and breathing difficulties.",
        "env_impact": "Prolonged severe air pollution creates acid deposition that damages coastal mangrove ecosystems and urban vegetation. Fine particulate matter settles on water bodies, affecting aquatic life and potentially entering the food chain through seafood. The smog reduces photosynthesis in urban plants, undermining Mumbai's already limited green spaces. Long-term persistent pollution degrades soil quality in peri-urban farming areas of Thane and Raigad. The particulate load in the atmosphere also alters local precipitation patterns, contributing to irregular monsoon distribution.",
        "ethics": "Mumbai's pollution disproportionately affects children, the elderly, and those with respiratory conditions in lower-income neighborhoods that lack indoor air filtration. Major sources — large construction projects, industrial truck traffic, and crop residue burning in neighboring states — are driven by economic decisions made without accounting for public health costs. The failure to enforce emission norms on industry and heavy transport represents a systemic prioritization of short-term commercial interest over long-term public welfare.",
        "actions": "Deploy real-time public AQI displays in all city zones with localized health advisories\nMandate water sprinklers and dust nets on all construction sites above 500 sq ft\nIncentivize farmers through direct transfers to adopt crop residue management alternatives\nAccelerate electrification of the entire BEST bus and auto-rickshaw fleet by 2027\nRequire green building certification for all new construction permits\nEstablish a multi-state air quality task force including Maharashtra, Punjab, and Haryana",
        "emoji": "💨",
        "color": "#1f1f0d",
        "featured": False,
    },
    {
        "title": "Satellite Data Reveals Alarming Forest Loss in Northeast India",
        "category": "deforestation",
        "impact": "high",
        "description": "Analysis of satellite imagery reveals that Northeast India lost over 1,200 sq km of forest cover in a single year — a rate scientists compare to Amazon deforestation patterns.",
        "body": "Analysis of satellite imagery from ISRO and Global Forest Watch reveals that Northeast India lost over 1,200 sq km of forest cover in 2024 — a rate scientists describe as approaching Amazon-scale relative to ecosystem size. Illegal logging networks, coal mining operations, and encroachment for jhum cultivation are identified as primary drivers. The forests lost include critical tiger corridors in Assam, cloud leopard habitat in Meghalaya, and primary old-growth forest in Arunachal Pradesh. The findings have triggered calls for a parliamentary review of forest diversion approvals.",
        "env_impact": "The forests of Northeast India are a recognized global biodiversity hotspot with thousands of endemic species found nowhere else on Earth. Their destruction releases massive quantities of stored carbon — equivalent to over 60 million tonnes of CO₂ in 2024 alone. Loss of forest cover reduces water retention in the region's thin soils, increasing both flash flood and drought risk downstream. Critical wildlife corridors for tigers, elephants, and rhinoceros have been severed in multiple locations, accelerating local population decline. The forests also regulate rainfall patterns across South and Southeast Asia.",
        "ethics": "Indigenous forest-dependent communities — including Bodo, Karbi, and Khasi peoples — who have sustainably managed these ecosystems for generations are losing their homes and livelihoods to commercial interests. The economic benefits flow primarily to distant corporations and consumers, while the costs — ecological destruction, cultural loss, displacement — fall entirely on communities with the least political voice. Legal loopholes enabling mining leases within designated forest land represent active state complicity in environmental destruction, in violation of the Forest Rights Act.",
        "actions": "Immediate moratorium on new mining leases in forested areas of the Northeast\nFull implementation of community forest rights under the Forest Rights Act 2006\nReal-time satellite-based forest monitoring with public dashboards updated monthly\nStrict prosecution and asset forfeiture for illegal logging networks\nDevelop sustainable forest enterprise alternatives: honey, bamboo, medicinal plants\nEngage Zomia indigenous governance systems as co-managers of protected areas",
        "emoji": "🌳",
        "color": "#0d1a0f",
        "featured": False,
    },
    {
        "title": "India Pledges 500 GW Renewable Energy by 2030 at COP Climate Summit",
        "category": "policy",
        "impact": "low",
        "description": "India's bold renewable energy pledge at the international climate summit signals a major policy shift, with commitments to solar expansion and a phased coal power phase-down timeline.",
        "body": "India's delegation at the latest COP summit announced a firm commitment to achieving 500 GW of renewable energy capacity by 2030, alongside a revised nationally determined contribution (NDC) that includes a phased coal retirement schedule for plants older than 25 years. The pledge, backed by international climate financing commitments totalling $12 billion, was welcomed by environmental groups while independent analysts noted that significant implementation, grid, and financing challenges remain. The government also announced a National Just Transition Mission to support coal-dependent workers and communities.",
        "env_impact": "If implemented fully, the commitment could prevent up to 1 billion tonnes of CO₂ emissions annually by 2030. Scaling solar and wind would significantly reduce coal plant air pollution, improving public health in energy-producing states. However, rapid solar expansion raises legitimate concerns about land use conflicts in farmland and forests, rare earth mineral mining impacts in supplier nations, and end-of-life management of solar panel waste. Careful siting planning is essential to avoid trading one environmental problem for another.",
        "ethics": "India's commitment is significant given its historically low contribution to cumulative global emissions relative to developed nations. The ethical weight lies in the equity dimension: wealthy industrialized nations that built their prosperity on fossil fuels have a greater obligation to act faster and provide genuine financing — not loans. Domestically, the transition must ensure coal-dependent workers and communities are not abandoned. A just transition is not an add-on; it must be central to implementation design from the outset.",
        "actions": "Establish a robust, adequately funded Just Transition mission for coal belt workers\nFast-track renewable land acquisition frameworks that protect community and tribal rights\nPressure developed nations to fulfill actual climate financing commitments — not repackaged loans\nInvest in battery storage and grid modernization at scale alongside generation capacity\nPublish transparent quarterly progress reports on renewable deployment against targets\nCreate a national solar panel recycling infrastructure ahead of the 2035 waste wave",
        "emoji": "⚡",
        "color": "#0d2010",
        "featured": False,
    },
    {
        "title": "Gangotri Glacier Retreats 22 Metres in a Single Year — Fastest on Record",
        "category": "glacier",
        "impact": "high",
        "description": "Scientific monitoring reveals the fastest single-year retreat of Gangotri Glacier ever recorded, threatening the long-term water security of over 400 million people downstream.",
        "body": "Geological Survey of India scientists monitoring the Gangotri Glacier — a primary source of the Ganges river — have recorded a retreat of 22 metres in 2024, the fastest annual retreat in 150 years of observations. The accelerating loss is attributed to rising temperatures and significantly reduced winter snowfall — a double driver not seen before in the instrumental record. Scientists warn the glacier's current trajectory could severely diminish dry-season river flows within two decades. A glaciological expedition documented the formation of three new glacial lakes above Gangotri, raising the specter of catastrophic Glacial Lake Outburst Floods (GLOFs).",
        "env_impact": "The Gangotri Glacier is one of the primary dry-season sources of the Ganga river system, upon which over 400 million people depend for drinking water, agriculture, and daily use. Its accelerating retreat directly threatens dry-season water availability. Ecosystem services provided by Himalayan glaciers — regulating temperature, sustaining perennial river flows, supporting high-altitude biodiversity — are being irreversibly lost. Newly formed glacial lakes create an imminent GLOF risk that could destroy downstream towns without warning. Glacial retreat also exposes dark rock that absorbs more heat, creating a dangerous feedback loop.",
        "ethics": "The people most immediately threatened by this glacier loss — farmers and communities in Uttarakhand and the Indo-Gangetic plain — have contributed negligibly to the global carbon emissions causing it. The glacier's retreat is a direct consequence of industrial activity by wealthy nations accumulated over two centuries. This is a climate injustice of profound and measurable scale. Future generations will inherit both the water stress and the irreversible loss of one of the world's great natural landmarks. This demands that the international community treat loss and damage not as charity but as legal obligation.",
        "actions": "Immediate binding emission reduction commitments with enforcement from all G20 nations\nExpand scientific glacial monitoring network with full public data access\nEngineer water conservation and storage infrastructure in glacially-dependent river basins\nDevelop climate-resilient agricultural practices for the Indo-Gangetic plain\nActivate a formal Loss and Damage compensation framework for climate-vulnerable nations\nEstablish GLOF early warning systems for all at-risk Himalayan communities",
        "emoji": "🏔️",
        "color": "#0d1525",
        "featured": False,
    },
]


def seed_data(db: Session):
    for data in ARTICLES:
        article = models.Article(**data)
        db.add(article)
    db.commit()
    print(f"[ClimateLens] Seeded {len(ARTICLES)} articles into the database.")
