# P10Scorer-nextjs

Phase 10 Scorer is a simple scoring app for the [Phase 10 Card Game](https://en.wikipedia.org/wiki/phase_10), demonstrating several recent libraries revolving around modern JS libraries.

- Note that this game scorer allows the winner to win their phases in any order - unlike the original rules where you must win the game in direct order.

The app is in active development and showcases a few modern tech features around the React ecosystem.

- [React 16.8 Hooks](https://reactjs.org/docs/hooks-intro.html)
  - Basics: useState, useEffect, useCallback, useMemo
  - Advanced: useImperativeHandle (for reaching into a forward ref component)
  - All non-nextjs-specific components are functional components.
  - All hooks are fully eslint'ed - ensuring all exhaustive-deps is sorted out is tricky yet very helpful, especially for animated components!
- [NextJS (Server-Side Rendering)](https://nextjs.org)
  - Somewhat magical platform - I had written this in create-react-app starting out, then used to implement SSR with great success
  - At present only localStorage is used for storing state, but this will change in the near future!
- [Emotion](https://emotion.sh/docs/introduction)
  - Excellent css-in-js library. Well documented, extremely performant
- [React-spring](https://www.react-spring.io)
  - Robust animation library. This app currently uses their latest beta version
- [React Hook Form](https://react-hook-form.com)
  - Convenient and simple hook-based form library - a great help to simplify usage of forms while still staying in a hook-based component.
- [Font Awesome 5](https://fontawesome.com)
  - This may currently cause problems if you don't have a Font Awesome Pro license. Feel free to reach out if this causes you an issue.
  - _IMPORTANT_ If you don't have a pro license, please checkout and use the free-images folder

And last but definitely not least, [TypeScript](https://www.typescriptlang.org) all around!

Any ideas for feedback please feel free to reach out!

Copyright (c) 2019 Barry May
