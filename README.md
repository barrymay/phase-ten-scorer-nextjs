# phase-ten-scorer-nextjs

Phase 10 Scorer is a simple scoring app for the [Phase 10 Card Game](https://en.wikipedia.org/wiki/phase_10), demonstrating several recent libraries revolving around modern JS libraries.

- Note that this game scorer allows the winner to win their phases in any order - unlike the original rules where you must win the game in direct order.

The app is in active development and showcases several modern tech features around the React ecosystem and OSS in general.

- [React 16.8+ Hooks](https://reactjs.org/docs/hooks-intro.html)
  - Basics: useState, useEffect, useCallback, useMemo
  - Advanced: useImperativeHandle (for reaching into a forward ref component)
  - All non-nextjs-specific components are functional components.
  - All hooks are fully eslint'ed - ensuring all exhaustive-deps is sorted out is tricky yet very helpful, especially for animated components!
- [NextJS (Server-Side Rendering)](https://nextjs.org)
  - Somewhat magical platform - I had written this in create-react-app starting out, then used to implement SSR with great success
  - At present only localStorage is used for storing state, but this will change in the near future!
- [Now](https://now.sh)
  - Serverless free hosting!
  - Major tip: Use `now dev` to run full now serverless in test mode
- [Emotion](https://emotion.sh/docs/introduction)
  - Excellent css-in-js library. Well documented, extremely performant
- [React-spring](https://www.react-spring.io)
  - Robust animation library. This app currently uses their latest beta version
- [React Hook Form](https://react-hook-form.com)
  - Convenient and simple hook-based form library - a great help to simplify usage of forms while still staying in a hook-based component.
- [Font Awesome 5](https://fontawesome.com)
  - This may currently cause problems if you don't have a Font Awesome Pro license. Feel free to reach out if this causes you an issue.
  - _IMPORTANT_ If you don't have a pro license, please checkout and use the free-images folder
- [Auth0](http://auth0.com)
  - Using the free tier for simplified authentication
- [Cypress](https://www.cypress.io)
  - Easily the best e2e JavaScript platform avaialble today. Took a little extra work to get it working with Next (sans Now) but this project can now be built with TypeScript-developed tests including support for Code Coverage (thank you `nyc`!).
- [Github Actions Beta](https://github.com/features/actions)
  - The new continuous integration platform integrated with Github. Extremely powerful, easy to integrate with.

And last but definitely not least, [TypeScript](https://www.typescriptlang.org) all around!

## Environment variables

Create an .env file in the root folder to be used as environment variables

- These same variables should be set to secrets on now.sh
- FA_PRO_AUTH should be set to a secret on Github if using Github Actions

```
# ./.env

ROOT_DOMAIN="http://localhost:3000"
AUTH0_CLIENT_SECRET="<AUTH0_CLIENT_SECRET>"
AUTH0_CALLBACK_URL="http://localhost:3000"
AUTH0_DOMAIN="<AUTH0_DOMAIN>"
AUTH0_CLIENT="<AUTH0_CLIENT_KEY>"
FA_PRO_AUTH="<FONT_AWESOME_PRO_KEY>" (if purchased)
```

## Building the App

Run the following when doing yarn install (if you need FA Pro) so that variables get set

```
export $(grep -v '^#' .env | xargs) && yarn install
```

Even if you're not running yarn install, you will likely need

```
export $(grep -v '^#' .env | xargs)
```

to set up your build environment

(Improvement ideas to this are welcome!)

### Development

The project is currently dependent on now for deployment, and that's where it's set is easiest (using now.json), but currently 'now dev' does not work well with Cypress on CI (Continuous Integration) by default, due to now dev's automatic HMR internals.

Therefore there are two flavors on which the build is done

#### Building for _now_

The `yarn dev` and `yarn publish` targets both simply depend on the now.sh infrastructure and functionality, using the `now.json` file for primary configuration. Neither are currently useful in terms of testing/Cypress.

#### Building for testing with _cypress_

The build targets `yarn dev-ci` and (by proxy) `yarn e2e` are build using the following:

- For Primary UI: `nextjs` on the root folder (now does the same)
- For Auth0 login server-login integration `./scripts/auth-server.ts`

The script `./scripts/next-server-startup.ts` is run by dev-ci in order to start the UI server AND create a reverse proxy so that localhost:3000 also hosts the endpoints from the Auth0 login server

- FYI - Now.sh essentially does the same thing without the need fo the reverse proxy hook. This step is primarily to ensure we can run cypress on CI.

(dev-ci and e2e also leverage the very convenient **concurrently** and **start-server-and-test** package to ensure easy cancelling of active jobs when errors occur)

The `e2e` target is set to run `dev-ci` and `cy:run` for the CI execution of Cypress

- Some changes were needed to ensure full good **TypeScript** support here along with the excellent testing library **@testing-library/cypress**, part of the new @testing-library ecosystem. At the point of this writing, the 4.x version of the testing-library package works best, since the types haven't been updated to support the findBy\* functions yet.

### Github Actions (beta)

This project uses the currently beta Github Actions platform for Cloud-based CI, and it's really coming along in terms of easy to use! Check out `.github/workflows/nodejs.yml` for the setup.

- Note that Github Actions automatically tries to build any new branches, so it really helps you check that you're stable as you evolve your project.
- On the master branch, we use Font Awesome Pro, hence the need for the FA_PRO_AUTH secret that you'll see in the nodejs.yml. If you're using the free-images branch, then the FA_PRO_AUTH is not used anywhere in the build process.

## Thank you!

People and Libraries I've gotten help and/or ideas from, along with the many excellent OSS packages mentioned above:

- User robmadole from Font Awesome, who helped me confirm my expectations of how the npm system works.
- https://github.com/bahmutov/next-and-cypress-example - Superb example of using cypress on top of nextjs, with support for nyc/istanbul for code coverage!
- https://github.com/awb305/Auth0-Nextjs-Serverless - Great example of integrating auth0 into a serverless nextjs example

## Other stuff

Any ideas or feedback please feel free to reach out!

Copyright (c) 2019 Barry May (barry4dev@outlook.com)
