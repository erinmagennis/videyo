# Videyo UI language

This is the shared vocabulary for the current Videyo workspace. Use these terms exactly in design and engineering discussion.

## Surfaces

- **Knowledge graph** means only the dots, face nodes, clips, relationship lines, and relationship labels.
- **Knowledge graph section** means the full dark surface containing the section title, explanation, compact stats strip, graph, Yo chat, and character card.
- **Unwind section** means the full story-order surface containing the horizontal timeline, scene cards, transcript, scene playback, and media tracks.
- **Final output** means the separate full-cut video at the bottom of the page.

## Spatial rules

- The graph section title is `yo, what belongs together?`.
- The graph explanation sits directly below that title.
- The stats strip sits directly below the explanation and directly above the graph dots.
- The stats strip uses a black background and is visually attached to the graph canvas.
- Yo's contextual chat stays above graph nodes, clips, labels, and lines.
- Clicking a character opens its complete character card in the graph section.
- The character card keeps the source artwork's proportions and shows current and previous versions.
- The unwind section title is `yo, what happens next?`.
- The timeline and scene workspace are one continuous section.
- The full video output is the last media surface on the page.

## Data rules

- Characters anchor the graph.
- Relationship lines describe character-to-character meaning and may include a scene proof point.
- Clips connect to a character only when the source material supports that relationship.
- A clip with no supported character relationship remains visibly unplaced rather than being forced onto a character.
- Character development percentages belong on character cards and character nodes, not only in the global stats strip.

## Interaction rules

- Selecting a graph character highlights its connected clips and scenes.
- Selecting a clip goes to its known scene or remains unplaced if it has no home.
- Selecting a scene in unwind updates the playback and transcript below it.
- Transcript rows seek the shared full video to their exact timestamp.
