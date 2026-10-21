#!/usr/bin/env python3
"""
scripts/seed_sanity_site.py
Seeds full baseline content into Sanity Content Lake so that PR #3 queries succeed without build errors.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"

def load_env() -> dict[str, str]:
    env = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip("'\"")
    return env

def main():
    env = load_env()
    token = env.get("SANITY_TOKEN")
    project_id = env.get("SANITY_PROJECT_ID", "ky8bcwum")
    dataset = env.get("SANITY_DATASET", "production")

    if not token:
        print("[ERROR] SANITY_TOKEN is required in .env", file=sys.stderr)
        sys.exit(1)

    # 1. Site Settings Document
    site_settings = {
        "_id": "siteSettings",
        "_type": "siteSettings",
        "short": "HACK",
        "name": "Hardware Acceleration Club of KUET",
        "university": "Khulna University of Engineering & Technology",
        "tagline": "A bench, patience, and problems worth solving.",
        "description": "HACK is the student club at KUET for FPGAs, GPUs and custom digital design. Members learn Verilog, build accelerators and compete nationally.",
        "founded": 2024,
        "email": "hack@kuet.ac.bd",
        "room": "Room 304, Digital Systems Lab",
        "address": "Department of Computer Science & Engineering, KUET, Khulna 9203",
        "mapUrl": "https://maps.google.com/?q=KUET+Khulna",
        "meets": "Thursdays from 5:00 PM to 8:00 PM",
        "intake": "Fall 2026 intake",
        "intakeCloses": "30 November 2026",
        "keywords": [
            "HACK KUET",
            "Hardware Acceleration Club of KUET",
            "KUET clubs",
            "KUET hardware club",
            "FPGA club Bangladesh",
            "Verilog workshop KUET",
            "GPU computing",
            "RISC-V",
            "digital design",
            "Khulna University of Engineering and Technology",
        ],
    }

    # 2. Home Story Document
    home_story = {
        "_id": "homeStory",
        "_type": "homeStory",
        "historyTitle": "From a lab drawer to custom silicon.",
        "historyLede": "In late 2024, three third-year students bought two Spartan-6 boards with their own stipend money. They met in empty classrooms after 6 PM to figure out how to drive a VGA display from raw Verilog.",
        "milestones": [
            {
                "_key": "m1",
                "year": "2024",
                "title": "Two boards and an empty classroom",
                "body": "First meetings happen after hours. The club has no budget, no permanent room and no formal name, just a shared checkout of two Xilinx boards.",
            },
            {
                "_key": "m2",
                "year": "2025",
                "title": "A bench of our own",
                "body": "The department allocates a permanent bench and six FPGA boards. The club hosts its first intra-university hardware sprint.",
            },
            {
                "_key": "m3",
                "year": "2026",
                "title": "Building a processor",
                "body": "Members begin a year-long project: a small RISC-V core, written, verified and run on an FPGA entirely by students.",
            },
        ],
        "missionStatement": "Give every KUET student who is curious about hardware a place to learn it by building: real boards, patient seniors and problems worth solving.",
        "missionItems": [
            {"_key": "mi1", "title": "Teach from zero", "body": "Weekly sessions assume no background. Seniors teach what they learned the year before."},
            {"_key": "mi2", "title": "Build real things", "body": "Every term ends with working hardware on a bench, not slides about hardware."},
            {"_key": "mi3", "title": "Share the work", "body": "Designs, notes and post-mortems stay open to the next batch."},
        ],
        "visionStatement": "A KUET where designing a chip feels as reachable to a student as writing an app, and where Bangladesh’s next hardware engineers get their start.",
        "visionItems": [
            {"_key": "vi1", "title": "A processor of our own", "body": "Finish the student-built RISC-V core and teach the first-year course on top of it."},
            {"_key": "vi2", "title": "A board for every member", "body": "Grow the bench until nobody has to wait a week for their turn on hardware."},
            {"_key": "vi3", "title": "Work that reaches industry", "body": "Send members into internships and research groups with designs they can show."},
        ],
    }

    # 3. Registration Options Document
    reg_options = {
        "_id": "registrationOptions",
        "_type": "registrationOptions",
        "departments": ["CSE", "EEE", "ECE", "ME", "CE", "IEM", "BME", "MSE", "MTE", "ESE", "ChE", "TE", "LE", "URP", "BECM", "Arch"],
        "batches": ["2K25", "2K24", "2K23", "2K22", "2K21"],
        "tracks": [
            {"_key": "t1", "id": "fpga", "title": "FPGA & digital design", "note": "Verilog, timing, getting designs onto boards"},
            {"_key": "t2", "id": "gpu", "title": "GPU & parallel computing", "note": "CUDA, OpenCL, making code scale"},
            {"_key": "t3", "id": "arch", "title": "Computer architecture", "note": "RISC-V, pipelines, how a CPU is built"},
            {"_key": "t4", "id": "embedded", "title": "Embedded systems", "note": "Microcontrollers, sensors, firmware"},
        ],
    }

    # 4. Hero Slides
    hero_slides = [
        {
            "_id": "heroSlide-1",
            "_type": "heroSlide",
            "orderRank": "0001",
            "label": "Custom silicon",
            "eyebrow": "Architecture",
            "title": "Software hits a wall. We build what gets past it.",
            "body": "Modern computing is hitting the limits of general-purpose chips. The most interesting problems are solved by engineers who design the silicon itself.",
            "figure": "LUT-level schematic of our 32-bit RISC-V ALU",
            "seed": 42,
            "hue": "navy",
        },
        {
            "_id": "heroSlide-2",
            "_type": "heroSlide",
            "orderRank": "0002",
            "label": "Bench work",
            "eyebrow": "From scratch",
            "title": "Real boards. No simulations where a wire should be.",
            "body": "Every member gets hands-on bench time: writing Verilog, probing clock lines with oscilloscopes and flashing actual FPGA bitstreams.",
            "figure": "Board setup during intra-university Hardware Sprint",
            "seed": 87,
            "hue": "blue",
        },
    ]

    # 5. Achievements
    achievements = [
        {"_id": "achievement-1", "_type": "achievement", "orderRank": "0001", "year": "2026", "title": "Real-time edge detection on a Zynq-7000", "event": "National Digital Design Contest, Dhaka", "result": "Champion"},
        {"_id": "achievement-2", "_type": "achievement", "orderRank": "0002", "year": "2025", "title": "GPU-accelerated flood simulation of the Rupsha basin", "event": "Inter-University Project Showcase, Khulna", "result": "1st runner-up"},
        {"_id": "achievement-3", "_type": "achievement", "orderRank": "0003", "year": "2025", "title": "Low-power CNN inference on a Lattice iCE40", "event": "IEEE student conference, Rajshahi", "result": "Paper accepted"},
        {"_id": "achievement-4", "_type": "achievement", "orderRank": "0004", "year": "2024", "title": "Streaming image-filter pipeline in Verilog", "event": "National Digital Design Contest, Dhaka", "result": "Finalist"},
    ]

    # 6. Events
    events = [
        {"_id": "event-1", "_type": "event", "date": "2026-10-15", "when": "15 Oct 2026, 5:00 PM", "title": "Open Lab: Tour the bench", "place": "Room 304, Digital Systems Lab", "body": "See the boards, try an interactive logic demo and meet seniors working on the RISC-V core."},
        {"_id": "event-2", "_type": "event", "date": "2026-11-13", "when": "13 to 14 Nov 2026", "title": "Hardware Sprint 2026", "place": "CSE Department, KUET", "body": "A 24-hour sprint: build and demo a working digital design on an FPGA board. Mentors on hand around the clock."},
        {"_id": "event-3", "_type": "event", "date": "2026-12-03", "when": "3 Dec 2026, 5:00 PM", "title": "RISC-V core demo day", "place": "Auditorium, CSE Building", "body": "Members demonstrate the student-built processor executing real binaries on hardware."},
    ]

    # 7. Navigation
    navigation = {
        "_id": "navigation",
        "_type": "navigation",
        "items": [
            {"_key": "n1", "key": "achievements", "label": "Achievements", "blurb": "Contest results and published work."},
            {"_key": "n2", "key": "events", "label": "Events", "blurb": "Workshops, sprints and what is coming next."},
            {"_key": "n3", "key": "gallery", "label": "Gallery", "blurb": "Sessions, builds and contest days."},
            {"_key": "n4", "key": "executive-board", "label": "Executive Board", "blurb": "The students running the club this year."},
        ],
    }

    mutations = [
        {"createOrReplace": site_settings},
        {"createOrReplace": home_story},
        {"createOrReplace": reg_options},
        {"createOrReplace": navigation},
    ]
    for s in hero_slides:
        mutations.append({"createOrReplace": s})
    for a in achievements:
        mutations.append({"createOrReplace": a})
    for e in events:
        mutations.append({"createOrReplace": e})

    print(f"[*] Submitting {len(mutations)} baseline content documents to Sanity ({project_id}/{dataset})...")
    url = f"https://{project_id}.api.sanity.io/v2024-01-01/data/mutate/{dataset}"
    req = urllib.request.Request(
        url,
        data=json.dumps({"mutations": mutations}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print(f"[SUCCESS] Synced {len(res.get('results', []))} baseline documents into Sanity Content Lake!")
        print(f"          Transaction ID: {res.get('transactionId')}")

if __name__ == "__main__":
    main()
