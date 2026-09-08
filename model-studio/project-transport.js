/* The application uses the same business interfaces in every deployment.
 * Production defaults to the server; a static showcase installs an explicit
 * synthetic transport before app.js starts. No provider keys enter the UI. */
let configured = null;
export function configureProjectTransport(transport) {
  if (configured) throw new Error('Project transport is already configured.');
  if (!transport || typeof transport.request !== 'function') throw new TypeError('A request adapter is required.');
  configured = transport;
}
export function projectRequest(path, options) {
  return configured ? configured.request(path, options) : fetch(path, options);
}
