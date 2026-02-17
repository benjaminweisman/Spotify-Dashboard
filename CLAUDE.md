# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spotify Dashboard - a dashboard application for Spotify. Uses Spotify API — your own listening history, audio features of tracks, genre analysis, and more.

Build a dashboard that pulls real data (public APIs like finance, sports, weather, or government data), processes it with Python, and displays it with React. 
Deploy it on your Netlify site. This covers: React, TypeScript, Python, data visualization, full-stack, end-to-end. Bonus points if it has a FastAPI or Node backend.

Each repo should include:
* Clear README with problem statement and architecture
* Setup instructions
* Screenshots or demo
* Clean folder structure
* Requirements file / Docker

The Spotify API is actually one of the best portfolio project options because it's inherently personal and interactive — anyone who sees it immediately wants to try it with their own data. Here's what you could build:
What data you can pull:
Spotify gives you access to a ton through their API — your top tracks and artists (short/medium/long term), your recently played history, saved library, and playlists. The really interesting part is audio features — for every track, Spotify assigns numerical scores for things like danceability, energy, valence (happiness), tempo, acousticness, instrumentalness, speechiness, and loudness. So every song becomes a data point with 8+ features.
Dashboard ideas:
Listening Profile Analyzer — Pull a user's top 50 tracks, get the audio features for each, and visualize their "musical fingerprint." Show radar charts of their average danceability/energy/valence, how it shifts between short-term vs long-term taste. Are you getting sadder over time? More energetic? The data tells a story.
Genre & Artist Network — Map out the relationships between your top artists using Spotify's "related artists" endpoint. Build an interactive network graph showing clusters of genres and how your taste connects across them. D3.js or vis.js would make this look incredible.
Mood Timeline — If you track recently played over time (you'd need to poll the API periodically and store it since Spotify only gives you the last 50), you could build a timeline showing mood patterns — do you listen to high-energy music in the morning? Sad music on Sundays? This is a natural time-series analysis project.
Playlist DNA — Let users paste a playlist link and get a breakdown of its audio profile compared to global averages. "Your workout playlist is in the 92nd percentile for energy but only 30th for danceability." You could even build a "playlist recommender" that suggests tracks to fill gaps.
The tech stack this naturally uses:

Backend: Python (FastAPI or Flask) or Node.js for the Spotify OAuth flow and API calls
Frontend: React with a charting library (Recharts, Chart.js, or D3 for the fancy stuff)
Database: MongoDB or PostgreSQL to store user listening history over time
Auth: Spotify OAuth 2.0 (this is actually great to have on your portfolio — shows you can implement real auth flows)
Deployment: Netlify for frontend, a small backend on Railway, Render, or AWS

Why this is a killer portfolio project:
It hits almost every keyword across both your resumes — React, Node, MongoDB, Python, full-stack, end-to-end, data visualization, and ML if you add a recommendation or clustering feature. It's also something a recruiter or interviewer can actually use, which makes it memorable. Most portfolio projects are static screenshots — this one is alive.
The one catch: Spotify's API requires OAuth, meaning users need to log in with their Spotify account. Spotify also has a review process if you want more than 25 users to access your app. For a portfolio piece that's fine — you can run it in "development mode" with up to 25 manually added users, or just demo it with your own data and record a walkthrough video.
If I were building this, I'd start with: a "Listening Profile Analyzer" that shows your top tracks, a radar chart of your audio feature averages, and a comparison between your short-term vs long-term taste. That's a clean MVP you could build in a weekend, and then layer on the fancier features over time.

let me know if you have any questions

## Repository Status