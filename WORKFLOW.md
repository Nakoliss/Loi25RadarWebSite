Scenario A: Building from Scratch (Mode A)
Use this when dragging in a screenshot to build a new component.

Prompt: "Clone this design into components/[ComponentName].tsx. Requirements:

Layout: Match the grid alignment, whitespace, and visual hierarchy exactly.

Typography: Replicate font weights and sizes. Use Geist Sans (default) unless the image clearly demands a serif.

Components: Use Shadcn/UI components where applicable (Buttons, Cards, Inputs).

Styling: Use Tailwind CSS utility classes. Match the color palette from the image.

Responsiveness: Ensure it is mobile-responsive (stack columns on small screens).

Content: Use the text from the image as placeholders."

Scenario B: Fixing a Bug / UI Tweak (Mode B)
Use this when taking a screenshot of your own local host to fix an error.

Prompt: "Fix the specific issue circled in this image. Context: This is my current build. Task: The [Element Name] is misaligned/broken. Fix the Tailwind classes to correct the layout. Constraint: Do NOT redesign the rest of the component. Only touch the broken part. Maintain existing colors and fonts."

Scenario C: Adding Logic (Supabase)
Use this text-only prompt to wire up the backend.

Prompt: "I need to add backend logic to this component.

Database: Create a Supabase Server Action in actions/[action-name].ts.

Validation: Use Zod to validate the input data (e.g., email, form fields).

Execution: Inside the action, use the Supabase client to insert/update data in the '[table_name]' table.

Feedback: Return a success/error state to the frontend and show a toast notification using sonner or useToast."

Scenario D: The Polish (Craft Signals)
Use this to remove the "AI look" and add professional touches.

Prompt: "Review the [Component.tsx] file.

Animation: Add framer-motion entrance animations. Elements should fade in and slide up slightly, staggered by 0.1s.

Interactivity: Add hover states to all interactive elements (scale 1.02, opacity change, or border glow).

Visuals: Ensure we aren't using default generic borders. Make the design feel 'premium' with subtle shadows or gradients."