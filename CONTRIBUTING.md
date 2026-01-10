# How to Add Content

The content of this app is powered by the TypeScript files in `src/data/topics`.

## 1. Edit Text Content
To change the text for a topic (Introduction, Explanation, etc.):
1.  Open the file corresponding to the module (e.g., `src/data/topics/fundamentals.ts`).
2.  Find the `subTopics` array.
3.  Edit the strings for `introduction`, `explanation`, `implementation`, or `example`.
    -   You can use `\n` for new lines or standard string formatting.

## 2. Add a Presentation (PPT)
To add a PowerPoint file to a topic:
1.  Place your `.pptx` file in the `public/presentations` folder.
    -   Create the folder if it doesn't exist: `mkdir public/presentations`.
2.  In the data file (e.g., `fundamentals.ts`), add the `pptUrl` property to the content object:
    ```typescript
    content: {
        ...
        explanation: "Your text explanation here...",
        pptUrl: "/presentations/my-slides.pptx"
    }
    ```
3.  The "Explanation" tab will now show a download button for this presentation below the text.
