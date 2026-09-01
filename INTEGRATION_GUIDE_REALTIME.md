# WebAvatar Realtime Integration Guide

This guide is for external developers embedding WebAvatar realtime voice modes. It covers installation, supported configuration, SPA lifecycle handling, and the HTML conventions required for reliable site navigation and form interaction.

## 1. Quick Start

Place the configuration and loader before `</body>`:

```html
<script>
  window.ChatWidgetConfig = {
    mode: "realtime-widget",
    widgetId: "YOUR_WIDGET_ID",
    userId: "customer-123",
    greetingInstruction: "Greet the user briefly.",
    enableBubble: "true",
    cameraOffset: "0,0,0"
  };

  (function () {
    if (document.getElementById("webavatar-jssdk")) return;
    var script = document.createElement("script");
    script.id = "webavatar-jssdk";
    script.src = "https://webavatar.didthat.cc/chat-widget.js";
    script.async = true;
    (document.head || document.body).appendChild(script);
  })();
</script>
```

Your production origin, including protocol and port, must be allowed for the supplied `widgetId`. Microphone access requires HTTPS except on `localhost`.

## 2. Display Modes

| Mode | Behavior | Recommended use |
|---|---|---|
| `realtime-widget` | Floating bottom-right assistant; avatar loads when the user connects. | Existing websites and applications |
| `realtime-fullscreen` | Full-viewport avatar and controls. | Dedicated voice experiences |

Setting `container: "#avatar-host"` in the initial configuration renders the realtime interface inside your element:

```html
<div id="avatar-host"></div>
<style>#avatar-host { position: relative; min-height: 600px; overflow: hidden; }</style>
```

## 3. Client Configuration

| Key | Type | Description |
|---|---|---|
| `mode` | `string` | Use `realtime-widget` or `realtime-fullscreen`. |
| `widgetId` | `string` | Required widget identifier. |
| `avatarUrl` | `string` | Optional explicit preset ID or absolute/relative `.vrm` URL. It overrides the dashboard selection for this embed. Omit it to use the saved widget avatar and global catalog fallback. |
| `userId` | `string` | Optional external visitor identifier for telemetry; it does not control authentication or billing. |
| `greetingInstruction` | `string/false` | Optional greeting guidance. Set to `false` to disable the greeting. |
| `container` | `string/HTMLElement` | Optional selector or element that owns the widget layout. |
| `enableBubble` | `string` | Use `"false"` to hide response bubbles; otherwise enabled. |
| `cameraOffset` | `string/object` | Camera target offset, such as `"0,0.2,1"` or `{ x: 0, y: 0.2, z: 1 }`. |
| `buttonImage` | `string` | Optional connect-button image URL. |

Allowed origins, navigation permissions, tools, credit behavior, and other security-sensitive settings are managed outside the embed code. Service endpoints are fixed in the published widget and cannot be supplied through `window.ChatWidgetConfig`.

## 4. Runtime API, Dynamic Configuration, and SPAs

`window.ChatWidget` is available after the widget bundle loads. The most useful realtime methods are:

| Method | Purpose |
|---|---|
| `sendUserMessage(text)` | Sends text to the active session; messages are queued while the connection is starting. |
| `setVolume(value)` | Sets avatar output volume from `0` to `1`. |
| `playAnimation(name)` | Plays a named avatar animation when the avatar is ready. |
| `onUserMessage(callback)` | Registers a callback for text messages submitted through the widget. |
| `updateConfig(changes)` | Merges configuration changes, cleans up the current instance, and remounts it. Returns a Promise. |
| `destroy()` | Disconnects and removes the widget, audio, avatar, WebGL resources, and observers. |

```javascript
window.ChatWidget?.setVolume(0.7);
window.ChatWidget?.sendUserMessage("Show me the available products.");
window.ChatWidget?.playAnimation("Waving");
```

### Changing `ChatWidgetConfig` at Runtime

Use `updateConfig()` for initialization-dependent settings such as `mode`, `widgetId`, `avatarUrl`, `container`, greeting, bubble, camera, or button configuration. It updates `window.ChatWidgetConfig`, releases the current instance, and remounts automatically:

```javascript
await window.ChatWidget.updateConfig({
  mode: "realtime-fullscreen",
  container: "#new-avatar-host",
  enableBubble: "false"
});
```

Create a new target container before calling the method. Calls are serialized, so awaiting each update is recommended. Updating configuration ends any active voice session before remounting; the user can reconnect afterward. Direct property assignment does not remount the active interface, and attempts to update fixed service endpoints are rejected without removing the widget.

### Component Lifecycle

Create the configuration after the target container exists. In React, Vue, Svelte, or similar frameworks, assign the mounted element directly to `container` instead of relying on a selector.

On component teardown, remove the complete widget and release its audio, WebGL, and observer resources:

```javascript
window.ChatWidget?.destroy?.();
```

The widget-management page uses this same contract for its in-page Preview action. It mounts
`realtime-widget` into a page-owned host, omits `avatarUrl` so the saved public avatar is used,
and calls `destroy()` before closing, switching widgets, applying a successful save, or leaving
the route. A late script load from an older preview is ignored, so only the latest selected
widget can mount. Its config Preview action moves between the Back row and config header at the
`lg` breakpoint. While that widget is active, both its list-card action and visible config action
become red Stop controls; either one disconnects and destroys the mounted preview.

### Client-Side Routing

Links should use real `href` values. For client-side routing, handle the cancelable navigation event and prevent the fallback page load only when your router accepts the destination:

```javascript
window.addEventListener("webavatar-navigate", (event) => {
  event.preventDefault();
  router.navigate(event.detail.target);
});
```

Expose each same-origin destination through a real `a[href]`; undiscoverable internal paths are rejected instead of guessed. Valid current-page hashes and permitted absolute HTTP(S) URLs remain supported.

## 5. Making the Parent Site AI-Ready

The assistant understands the parent page through its rendered DOM. Semantic HTML, stable labels, and visible state produce the most reliable results.

### Required Markup Conventions

| Purpose | Recommended markup |
|---|---|
| Page regions | `nav`, `main`, `section`, `article`, `aside`, `header`, `footer` |
| Actions | `button`, `a[href]`, or a custom control with the correct ARIA role |
| Form fields | Native `input`, `textarea`, and `select` with explicit labels |
| Expandable content | `details > summary` or a control with `aria-expanded` |
| Dynamic state | Visible DOM text plus attributes such as `disabled`, `checked`, `aria-selected`, or `aria-expanded` |
| Major destinations | Stable links and meaningful section IDs |

Use `aria-label` or `aria-labelledby` when visible text is missing or ambiguous. Keep labels stable while values such as cart totals or counters change.

```html
<header>
  <nav aria-label="Primary navigation">
    <a href="/products">Products</a>
    <a href="/contact">Contact</a>
  </nav>

  <button id="cart-button" aria-label="Shopping cart">
    Cart <span class="cart-count" aria-live="polite">0</span>
  </button>
</header>

<main>
  <section id="products" aria-labelledby="products-title">
    <h2 id="products-title">Products</h2>

    <article aria-label="Espresso">
      <h3>Espresso</h3>
      <button type="button" aria-label="Add Espresso to cart">
        Add to cart
      </button>
    </article>
  </section>

  <section id="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">Contact</h2>

    <form>
      <label for="topic">Topic</label>
      <select id="topic" name="topic">
        <option value="sales">Sales</option>
        <option value="support">Support</option>
      </select>

      <label for="email">Email address</label>
      <input id="email" name="email" type="email" required>

      <button type="submit">Send message</button>
    </form>
  </section>
</main>
```

### Practical Rules

- Prefer native controls over clickable `div` or `span` elements.
- Give repeated actions item-specific context, such as `aria-label="Add Espresso to cart"`.
- Associate every field with `<label for="...">`; do not rely only on placeholders.
- Prefer native `select`, checkbox, radio, and date controls. Use `YYYY-MM-DD` for date values.
- Keep stable `id`, `name`, and `href` values across renders.
- Mark filters with native controls or roles such as `tablist`/`tab` and `aria-selected`. Mark pagination with a navigation label, `aria-current="page"`, and labelled previous/next controls when possible.
- Render important content and state in the light DOM. Updating only a canvas, image, or internal JavaScript variable is not observable.
- Update the DOM promptly after an action so the assistant can detect the resulting state.

### Compatibility Limits

- Closed or encapsulated Shadow DOM content is not discoverable.
- Canvas, WebGL, image-only, and plugin-rendered content cannot be read as page structure.
- Custom controls require correct roles, labels, state attributes, keyboard behavior, and native events.
- Very slow asynchronous updates may require the user to wait before the next instruction.

### Browser Extension Runtime

When the realtime widget runs inside the WebAvatar Chrome extension rather than
a normal web embed, two behaviors differ:

- **Approval for page actions**: mutating/navigating tools (`click_element`,
  `fill_form_fields`, `navigate_parent_site`, `browser_history_back`) show
  an in-page approval dialog before executing (extension-only). Timeouts, hidden
  or navigated pages, and session end default to deny; read-only scans and avatar
  tools stay automatic. Normal web embeds keep fully-automatic tool execution.
- **Sign-in persistence**: extension credentials are held only in
  `chrome.storage.session`, so users stay signed in across tab switches and
  service-worker restarts but must sign in again after a full browser restart.

## 6. Troubleshooting

| Problem | Checks |
|---|---|
| Widget does not connect | Verify `widgetId`, allowed origin, network/CSP errors, then retry for a fresh session. |
| Microphone does not work | Use HTTPS or `localhost`, allow microphone access, and avoid restrictive in-app browsers. |
| An element cannot be found | Use semantic controls, explicit labels, visible light-DOM state, and stable selectors. |
| SPA navigation reloads | Handle `webavatar-navigate`, call `preventDefault()`, and route to `event.detail.target`. |
| Container layout is incorrect | Give it non-zero height and `position: relative`; destroy the old widget before remounting. |
| A custom API tool is unavailable | Confirm it is enabled, has a public HTTPS endpoint, uses declared parameters, and reconnect to obtain a new provider token after dashboard changes. |
