/* @ds-bundle: {"format":4,"namespace":"DocumaDesignSystem_7668c6","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"TemplateCard","sourcePath":"components/core/TemplateCard.jsx"},{"name":"DocSlot","sourcePath":"components/document/DocSlot.jsx"},{"name":"ImagePoint","sourcePath":"components/document/ImagePoint.jsx"},{"name":"ImageSlot","sourcePath":"components/document/ImageSlot.jsx"},{"name":"LimitNotice","sourcePath":"components/feedback/LimitNotice.jsx"},{"name":"StampCounter","sourcePath":"components/feedback/StampCounter.jsx"},{"name":"Dropzone","sourcePath":"components/forms/Dropzone.jsx"},{"name":"MicButton","sourcePath":"components/forms/MicButton.jsx"},{"name":"TextArea","sourcePath":"components/forms/TextArea.jsx"}],"sourceHashes":{"components/core/Button.jsx":"f8cb831eace8","components/core/TemplateCard.jsx":"48c8e170775c","components/document/DocSlot.jsx":"4e492c3bb3c8","components/document/ImagePoint.jsx":"665193907baf","components/document/ImageSlot.jsx":"236ebb936a8f","components/feedback/LimitNotice.jsx":"e3ad6781be51","components/feedback/StampCounter.jsx":"09784064870e","components/forms/Dropzone.jsx":"28aefef32464","components/forms/MicButton.jsx":"dc4e35f19f5d","components/forms/TextArea.jsx":"b6b6d1d9acb7","exploration/landing/LandingLayouts.jsx":"2cc5c4956a93","exploration/landing/LandingShared.jsx":"4a58d9c39bc1","ui_kits/documa-web/Workbench.jsx":"6b5a8c42c393"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DocumaDesignSystem_7668c6 = window.DocumaDesignSystem_7668c6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
/**
 * Documa's single button primitive. Two visual variants match the two
 * buttons that exist in the source demo: the solid teal "generate" CTA and
 * the transparent "ghost" secondary action. Flat colors only — no shadows.
 */
function Button({
  variant = 'primary',
  size = 'base',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button'
}) {
  const base = {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--weight-semibold)',
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius-base)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)`,
    opacity: disabled ? 0.4 : 1,
    width: fullWidth ? '100%' : 'auto',
    border: 'none'
  };
  const sizes = {
    base: {
      padding: '15px',
      fontSize: 'var(--text-md)'
    },
    compact: {
      padding: '12px',
      fontSize: '13.5px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--brand-primary)',
      color: 'var(--brand-primary-ink)'
    },
    dark: {
      background: 'var(--surface-inverse)',
      color: 'var(--brand-primary-ink)'
    },
    ghost: {
      background: 'transparent',
      border: '1px solid var(--border-hairline-light)',
      color: 'var(--text-secondary-light)',
      padding: '12px'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? variant === 'primary' ? {
    background: 'var(--brand-primary-hover)'
  } : variant === 'dark' ? {
    background: 'var(--surface-inverse-hover)'
  } : {
    borderColor: 'var(--text-primary-light)',
    color: 'var(--text-primary-light)'
  } : {};
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...hoverStyle
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/TemplateCard.jsx
try { (() => {
/**
 * A selectable row in the template picker. Shows the template name, a small
 * mono meta line (slot counts), and the raw placeholder tokens beneath —
 * Documa always shows its own {{tokens}} rather than hiding them. Stacked
 * (not side-by-side) so it stays robust at narrow column widths.
 */
function TemplateCard({
  name,
  textSlots = [],
  imageSlots = [],
  active = false,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      textAlign: 'left',
      background: active ? 'var(--brand-primary-wash)' : 'var(--surface-raised)',
      border: `1px solid ${active ? 'var(--brand-primary)' : hover ? 'var(--brand-primary)' : 'var(--border-hairline-dark)'}`,
      borderRadius: 'var(--radius-base)',
      padding: '11px 14px',
      color: 'var(--text-primary-dark)',
      cursor: 'pointer',
      transition: 'all var(--duration-fast) var(--ease-standard)',
      display: 'block',
      fontFamily: 'inherit',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 'var(--weight-semibold)',
      fontFamily: 'var(--font-display)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-meta)',
      color: 'var(--text-secondary-dark)',
      marginTop: 3
    }
  }, textSlots.length, " texto \xB7 ", imageSlots.length, " imagen", imageSlots.length === 1 ? '' : 'es'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      lineHeight: 1.6,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent-warm)'
    }
  }, textSlots.map(s => `{{${s}}}`).join(' ')), imageSlots.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-primary-hover)'
    }
  }, " ", imageSlots.map(s => `{%%${s}}`).join(' '))));
}
Object.assign(__ds_scope, { TemplateCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TemplateCard.jsx", error: String((e && e.message) || e) }); }

// components/document/DocSlot.jsx
try { (() => {
/**
 * A text placeholder slot inside the generated document. Mirrors the four
 * states from the source: empty (shows the raw {{token}} chip), filling
 * (a caret while the AI "types" the answer in), pending (AI explicitly
 * marked this field as unanswered — never fabricated), and filled.
 */
function DocSlot({
  label,
  token,
  state = 'empty',
  children
}) {
  const labelColor = state === 'pending' ? 'var(--state-pending-text)' : state === 'filling' ? 'var(--accent-warm)' : 'var(--brand-primary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-label)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: state === 'filled' ? 'var(--brand-primary)' : labelColor,
      marginBottom: 5,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-regular)',
      color: 'var(--text-muted-light)',
      textTransform: 'none',
      letterSpacing: 0
    }
  }, `{{${token}}}`)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: state === 'pending' ? 'var(--state-pending-text)' : 'var(--text-primary-light)',
      fontFamily: state === 'pending' ? 'var(--font-mono)' : 'var(--font-body)',
      fontStyle: state === 'empty' ? 'italic' : 'normal',
      fontSize: state === 'pending' ? '12.5px' : 'var(--text-base)',
      minHeight: 20
    }
  }, state === 'empty' ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      background: 'var(--state-pending-bg)',
      color: 'var(--state-pending-text)',
      padding: '2px 8px',
      borderRadius: 'var(--radius-sm)',
      border: '1px dashed var(--state-pending-border)'
    }
  }, `{{${token}}}`) : state === 'pending' ? '_Pendiente de completar_' : children));
}
Object.assign(__ds_scope, { DocSlot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/document/DocSlot.jsx", error: String((e && e.message) || e) }); }

// components/document/ImagePoint.jsx
try { (() => {
/**
 * The upload row on the input side (left panel) — one per image placeholder
 * the selected template defines. Distinct from ImageSlot, which is the
 * read-only result shown inside the generated document on the right.
 */
function ImagePoint({
  token,
  label,
  thumbSrc,
  onPick
}) {
  const filled = !!thumbSrc;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px ${filled ? 'solid' : 'dashed'} ${filled ? 'var(--brand-primary)' : 'var(--border-hairline-dark)'}`,
      borderRadius: 'var(--radius-base)',
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 54,
      height: 54,
      borderRadius: 'var(--radius-sm)',
      flexShrink: 0,
      background: 'var(--surface-app)',
      border: '1px solid var(--border-hairline-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, filled ? /*#__PURE__*/React.createElement("img", {
    src: thumbSrc,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 18,
      color: 'var(--border-hairline-dark)'
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--brand-primary-hover)'
    }
  }, `{%%${token}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-secondary-dark)',
      marginTop: 2
    }
  }, filled ? 'Foto lista · se ajustará sola' : label)), /*#__PURE__*/React.createElement("button", {
    onClick: onPick,
    style: {
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-hairline-dark)',
      color: 'var(--text-primary-dark)',
      borderRadius: 'var(--radius-sm)',
      padding: '7px 12px',
      fontSize: 12,
      cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap'
    }
  }, filled ? 'Cambiar' : 'Elegir foto'));
}
Object.assign(__ds_scope, { ImagePoint });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/document/ImagePoint.jsx", error: String((e && e.message) || e) }); }

// components/document/ImageSlot.jsx
try { (() => {
/**
 * An image placeholder inside the generated document. Photos are always
 * shown with object-fit: contain inside a bordered frame — auto-fit without
 * distortion or cropping is a core product claim, never stretch/crop here.
 */
function ImageSlot({
  label,
  token,
  src,
  caption
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-label)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-regular)',
      color: 'var(--text-muted-light)',
      textTransform: 'none',
      letterSpacing: 0
    }
  }, `{%%${token}}`)), src ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hairline-light)',
      background: 'var(--surface-raised)',
      borderRadius: 'var(--radius-sm)',
      maxWidth: 320,
      maxHeight: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      maxWidth: 320,
      maxHeight: 220,
      width: 'auto',
      height: 'auto',
      objectFit: 'contain',
      display: 'block'
    }
  })), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-secondary-light)',
      marginTop: 5,
      fontStyle: 'italic'
    }
  }, caption)) : /*#__PURE__*/React.createElement("div", {
    style: {
      height: 120,
      width: '100%',
      color: 'var(--text-muted-light)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      border: '1px solid var(--border-hairline-light)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "sin foto"));
}
Object.assign(__ds_scope, { ImageSlot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/document/ImageSlot.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LimitNotice.jsx
try { (() => {
/**
 * The panel shown once the demo-generation quota is exhausted. Honest about
 * the limit and why it exists — never hide or soften a hard stop.
 */
function LimitNotice({
  title,
  description,
  resetLabel = 'Reiniciar demo',
  onReset,
  visible = true
}) {
  if (!visible) return null;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-raised)',
      border: '1px solid var(--accent-warm)',
      borderRadius: 'var(--radius-base)',
      padding: 22,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-lg)',
      marginBottom: 6,
      color: 'var(--accent-warm)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary-dark)',
      margin: 0
    }
  }, description), /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'none',
      border: `1px solid ${hover ? 'var(--accent-warm)' : 'var(--border-hairline-dark)'}`,
      color: 'var(--text-primary-dark)',
      borderRadius: 'var(--radius-sm)',
      padding: '7px 12px',
      marginTop: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      cursor: 'pointer'
    }
  }, resetLabel));
}
Object.assign(__ds_scope, { LimitNotice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LimitNotice.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StampCounter.jsx
try { (() => {
/**
 * Circular "generations remaining" indicator. Spent stamps get a diagonal
 * strike pattern — the one place in the system a decorative gradient is
 * used, and it's a strike-through, not a background wash.
 */
function StampCounter({
  total = 3,
  remaining = 3
}) {
  const stamps = Array.from({
    length: total
  }, (_, i) => total - i);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: 'var(--tracking-widest)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary-dark)'
    }
  }, "Generaciones restantes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7
    }
  }, stamps.map((n, i) => {
    const spent = total - remaining > total - 1 - i;
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-circle)',
        border: `1.5px solid ${spent ? 'var(--border-hairline-dark)' : 'var(--accent-warm)'}`,
        color: spent ? 'var(--border-hairline-dark)' : 'var(--accent-warm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 'var(--weight-bold)',
        position: 'relative',
        transition: 'all var(--duration-slow) var(--ease-standard)',
        overflow: 'hidden'
      }
    }, n, spent && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(45deg, transparent 46%, var(--border-hairline-dark) 46%, var(--border-hairline-dark) 54%, transparent 54%)'
      }
    }));
  })));
}
Object.assign(__ds_scope, { StampCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StampCounter.jsx", error: String((e && e.message) || e) }); }

// components/forms/Dropzone.jsx
try { (() => {
function formatBytes(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A drag-and-drop file dropzone. Idle/drag-over/filled states, plus a
 * click-to-browse fallback (native file input) — drag-and-drop should never
 * be the *only* way in. No icon set exists in this brand, so affordance is
 * typographic only: the same "+" glyph ImagePoint uses for "add", not an
 * invented upload/cloud icon.
 */
function Dropzone({
  label,
  hint = 'o haz clic para elegir',
  accept,
  multiple = true,
  initialFiles = [],
  onFilesChange
}) {
  const [files, setFiles] = React.useState(initialFiles);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef(null);
  function commit(next) {
    setFiles(next);
    onFilesChange && onFilesChange(next);
  }
  function addFiles(list) {
    const incoming = Array.from(list).map(f => ({
      name: f.name,
      size: f.size
    }));
    commit(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  }
  function removeAt(i) {
    commit(files.filter((_, idx) => idx !== i));
  }
  return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary-dark)',
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    onClick: () => inputRef.current && inputRef.current.click(),
    onDragEnter: e => {
      e.preventDefault();
      setDragging(true);
    },
    onDragOver: e => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: e => {
      e.preventDefault();
      setDragging(false);
    },
    onDrop: e => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    style: {
      minHeight: 116,
      border: `1.5px dashed ${dragging ? 'var(--brand-primary)' : 'var(--border-hairline-dark)'}`,
      background: dragging ? 'var(--brand-primary-wash)' : 'var(--surface-raised)',
      borderRadius: 'var(--radius-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 16,
      cursor: 'pointer',
      transition: 'all var(--duration-fast) var(--ease-standard)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 20,
      lineHeight: 1,
      color: dragging ? 'var(--brand-primary)' : 'var(--text-secondary-dark)'
    }
  }, "+"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: dragging ? 'var(--brand-primary)' : 'var(--text-primary-dark)'
    }
  }, dragging ? 'Suelta para subir' : 'Arrastra un archivo aquí'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--text-secondary-dark)'
    }
  }, hint), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: accept,
    multiple: multiple,
    onChange: e => {
      if (e.target.files.length) addFiles(e.target.files);
      e.target.value = '';
    },
    style: {
      display: 'none'
    }
  })), files.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginTop: 8
    }
  }, files.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: f.name + i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      border: '1px solid var(--border-hairline-dark)',
      borderRadius: 'var(--radius-base)',
      padding: '9px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--text-secondary-dark)'
    }
  }, formatBytes(f.size))), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeAt(i),
    "aria-label": `Quitar ${f.name}`,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--text-secondary-dark)',
      cursor: 'pointer',
      fontSize: 17,
      lineHeight: 1,
      padding: 4
    }
  }, "\xD7")))));
}
Object.assign(__ds_scope, { Dropzone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Dropzone.jsx", error: String((e && e.message) || e) }); }

// components/forms/MicButton.jsx
try { (() => {
/**
 * Voice-dictation toggle. Three states: idle, recording (pulsing red dot),
 * and unsupported (browser lacks SpeechRecognition — disabled, relabeled).
 * Always degrade gracefully to unsupported rather than hiding the control.
 */
function MicButton({
  recording = false,
  supported = true,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: !supported,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      background: 'var(--surface-raised)',
      border: `1px solid ${recording ? 'var(--state-danger)' : hover && supported ? 'var(--brand-primary)' : 'var(--border-hairline-dark)'}`,
      color: recording ? 'var(--state-danger-text)' : 'var(--text-primary-dark)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 13px 6px 10px',
      fontFamily: 'inherit',
      fontSize: 12,
      cursor: supported ? 'pointer' : 'not-allowed',
      opacity: supported ? 1 : 0.45,
      transition: 'all var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 'var(--radius-circle)',
      background: recording ? 'var(--state-danger)' : 'var(--text-secondary-dark)',
      flexShrink: 0,
      animation: recording ? 'documa-mic-pulse var(--pulse-duration) ease-in-out infinite' : 'none'
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes documa-mic-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: .5; } }`), /*#__PURE__*/React.createElement("span", null, !supported ? 'Voz no disponible' : recording ? 'Detener' : 'Dictar'));
}
Object.assign(__ds_scope, { MicButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MicButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextArea.jsx
try { (() => {
/**
 * The raw-notes input. Grows tall by default (this is a notes dump, not a
 * one-line field). `listening` swaps the focus color to danger red while
 * voice dictation is live (paired with MicButton).
 */
function TextArea({
  value,
  onChange,
  placeholder,
  listening = false,
  minHeight = 150
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = listening ? 'var(--state-danger)' : focused ? 'var(--brand-primary)' : 'var(--border-hairline-dark)';
  return /*#__PURE__*/React.createElement("textarea", {
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      minHeight,
      resize: 'vertical',
      background: 'var(--surface-raised)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-base)',
      color: 'var(--text-primary-dark)',
      padding: 14,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 1.6,
      outline: 'none',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  });
}
Object.assign(__ds_scope, { TextArea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextArea.jsx", error: String((e && e.message) || e) }); }

// exploration/landing/LandingLayouts.jsx
try { (() => {
// Four layout/composition directions for the Documa landing page. Same
// content, colors, type, and components throughout — only structure and
// emphasis change between them.

function Page({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-app)',
      minHeight: '100vh'
    }
  }, children);
}
function Wrap({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 32px',
      ...style
    }
  }, children);
}

// ---------- A: Classic centered ----------
function LandingA() {
  const {
    Button
  } = window.DocumaDesignSystem_7668c6;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(window.NavBar, null), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      textAlign: 'center',
      padding: '72px 32px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 16
    }
  }, window.HERO.eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 44,
      lineHeight: 1.15,
      letterSpacing: '-0.01em',
      maxWidth: 720,
      margin: '0 auto 20px'
    }
  }, window.HERO.headline), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--text-secondary-dark)',
      maxWidth: 480,
      margin: '0 auto 28px',
      lineHeight: 1.6
    }
  }, window.HERO.subhead), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, window.HERO.ctaPrimary)), /*#__PURE__*/React.createElement("a", {
    href: "#como-funciona",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, window.HERO.ctaSecondary))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(window.StackIllustration, null))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '64px 32px'
    },
    id: "como-funciona"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "01",
    label: "Proceso",
    heading: "C\xF3mo funciona",
    center: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 40,
      textAlign: 'left'
    }
  }, window.STEPS.map(s => /*#__PURE__*/React.createElement(window.StepColumn, {
    key: s.n,
    step: s
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '64px 32px'
    },
    id: "caracteristicas"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "02",
    label: "Producto",
    heading: "Caracter\xEDsticas",
    center: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16
    }
  }, window.FEATURES.map(f => /*#__PURE__*/React.createElement(window.FeatureCard, {
    key: f.title,
    f: f
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '64px 32px'
    },
    id: "demo"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "03",
    label: "Demo",
    heading: "Pru\xE9balo t\xFA mismo",
    center: true
  }), /*#__PURE__*/React.createElement(window.DemoFrame, {
    labelBar: true
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '64px 32px',
      maxWidth: 760
    },
    id: "faq"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "04",
    label: "Dudas",
    heading: "Preguntas frecuentes"
  }), /*#__PURE__*/React.createElement(window.FaqAccordion, {
    items: window.FAQS
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px 64px'
    }
  }, /*#__PURE__*/React.createElement(window.FinalCta, null)), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement(window.Footer, null)));
}

// ---------- B: Split hero, product-adjacent ----------
function LandingB() {
  const {
    Button,
    DocSlot,
    ImageSlot
  } = window.DocumaDesignSystem_7668c6;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(window.NavBar, null), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 16
    }
  }, window.HERO.eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 38,
      lineHeight: 1.18,
      letterSpacing: '-0.01em',
      margin: '0 0 18px'
    }
  }, window.HERO.headline), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--text-secondary-dark)',
      marginBottom: 26,
      lineHeight: 1.6,
      maxWidth: 420
    }
  }, window.HERO.subhead), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, window.HERO.ctaPrimary)), /*#__PURE__*/React.createElement("a", {
    href: "#como-funciona",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, window.HERO.ctaSecondary)))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hairline-dark)',
      borderRadius: 'var(--radius-base)',
      background: 'var(--surface-paper)',
      padding: '22px 26px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--text-secondary-light)',
      marginBottom: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "informe_actividad.docx"), /*#__PURE__*/React.createElement(DocSlot, {
    label: "Objetivo del periodo",
    token: "objetivo",
    state: "filled"
  }, "Mejorar los tiempos de atenci\xF3n al cliente."), /*#__PURE__*/React.createElement(DocSlot, {
    label: "Pendientes",
    token: "pendientes",
    state: "pending"
  }), /*#__PURE__*/React.createElement(ImageSlot, {
    label: "Foto de evidencia",
    token: "foto_evidencia"
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "como-funciona"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "01",
    label: "Proceso",
    heading: "C\xF3mo funciona"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, window.STEPS.map((s, i) => /*#__PURE__*/React.createElement(window.StepInline, {
    key: s.n,
    step: s,
    showLine: i > 0
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "caracteristicas"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "02",
    label: "Producto",
    heading: "Caracter\xEDsticas"
  }), /*#__PURE__*/React.createElement("div", null, window.FEATURES.map(f => /*#__PURE__*/React.createElement(window.FeatureListRow, {
    key: f.title,
    f: f
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "demo"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "03",
    label: "Demo",
    heading: "Pru\xE9balo t\xFA mismo"
  }), /*#__PURE__*/React.createElement(window.DemoFrame, {
    labelBar: true
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px',
      maxWidth: 760
    },
    id: "faq"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "04",
    label: "Dudas",
    heading: "Preguntas frecuentes"
  }), /*#__PURE__*/React.createElement(window.FaqAccordion, {
    items: window.FAQS
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px 56px'
    }
  }, /*#__PURE__*/React.createElement(window.FinalCta, null)), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement(window.Footer, null)));
}

// ---------- C: Editorial, big type ----------
function LandingC() {
  const {
    Button
  } = window.DocumaDesignSystem_7668c6;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(window.NavBar, {
    minimal: true
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '48px 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 20
    }
  }, window.HERO.eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 68,
      lineHeight: 1.03,
      letterSpacing: '-0.02em',
      margin: '0 0 30px',
      maxWidth: 980
    }
  }, window.HERO.headline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 40,
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6,
      maxWidth: 420,
      margin: 0
    }
  }, window.HERO.subhead), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, window.HERO.ctaPrimary)), /*#__PURE__*/React.createElement("a", {
    href: "#como-funciona",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, window.HERO.ctaSecondary))))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "como-funciona"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "01",
    label: "Proceso",
    heading: "C\xF3mo funciona"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      paddingTop: 8
    }
  }, window.STEPS.map((s, i) => /*#__PURE__*/React.createElement(window.StepInline, {
    key: s.n,
    step: s,
    showLine: i > 0
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "caracteristicas"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "02",
    label: "Producto",
    heading: "Caracter\xEDsticas"
  }), /*#__PURE__*/React.createElement("div", null, window.FEATURES.map(f => /*#__PURE__*/React.createElement(window.FeatureListRow, {
    key: f.title,
    f: f
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "demo"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "03",
    label: "Demo",
    heading: "Pru\xE9balo t\xFA mismo"
  }), /*#__PURE__*/React.createElement(window.DemoFrame, {
    labelBar: true
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px',
      maxWidth: 760
    },
    id: "faq"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "04",
    label: "Dudas",
    heading: "Preguntas frecuentes"
  }), /*#__PURE__*/React.createElement(window.FaqStatic, {
    items: window.FAQS
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px 56px'
    }
  }, /*#__PURE__*/React.createElement(window.FinalCta, null)), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement(window.Footer, null)));
}

// ---------- D: Product-first ----------
function LandingD() {
  const {
    Button
  } = window.DocumaDesignSystem_7668c6;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement(window.NavBar, {
    minimal: true
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '40px 32px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 14
    }
  }, "As\xED de simple"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 32,
      lineHeight: 1.2,
      margin: '0 auto 12px',
      maxWidth: 640
    }
  }, window.HERO.headline)), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px 56px'
    },
    id: "demo"
  }, /*#__PURE__*/React.createElement(window.DemoFrame, {
    labelBar: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--text-secondary-dark)',
      maxWidth: 480,
      margin: '0 auto 20px',
      lineHeight: 1.6
    }
  }, window.HERO.subhead), /*#__PURE__*/React.createElement("a", {
    href: "#caracteristicas",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, window.HERO.ctaSecondary)))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "como-funciona"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "01",
    label: "Proceso",
    heading: "C\xF3mo funciona",
    center: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 40,
      textAlign: 'left'
    }
  }, window.STEPS.map(s => /*#__PURE__*/React.createElement(window.StepColumn, {
    key: s.n,
    step: s
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px'
    },
    id: "caracteristicas"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "02",
    label: "Producto",
    heading: "Caracter\xEDsticas",
    center: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      flexWrap: 'wrap'
    }
  }, window.FEATURES.map(f => /*#__PURE__*/React.createElement(window.FeatureStrip, {
    key: f.title,
    f: f
  })))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px',
      maxWidth: 760
    },
    id: "faq"
  }, /*#__PURE__*/React.createElement(window.SectionHead, {
    n: "03",
    label: "Dudas",
    heading: "Preguntas frecuentes",
    center: true
  }), /*#__PURE__*/React.createElement(window.FaqAccordion, {
    items: window.FAQS
  })), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px 56px'
    }
  }, /*#__PURE__*/React.createElement(window.FinalCta, null)), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement(window.Footer, null)));
}
Object.assign(window, {
  LandingA,
  LandingB,
  LandingC,
  LandingD
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "exploration/landing/LandingLayouts.jsx", error: String((e && e.message) || e) }); }

// exploration/landing/LandingShared.jsx
try { (() => {
// Shared content + small marketing-page building blocks for the Documa
// landing-page exploration. Copy is grounded ONLY in what the demo + manual
// actually show (no fabricated stats/testimonials/pricing — user opted out).

const STEPS = [{
  n: '01',
  title: 'Pega o dicta tus notas',
  body: 'Escribe libre o dicta por voz — no hace falta ordenar nada de antemano.'
}, {
  n: '02',
  title: 'Sube tus fotos',
  body: 'Se ajustan solas a cada espacio de la plantilla, sin recortes ni deformación.'
}, {
  n: '03',
  title: 'Genera tu documento',
  body: 'La IA reparte el texto en los campos correctos y marca lo que falta — nunca inventa datos.'
}];
const FEATURES = [{
  title: 'Conserva el formato de tu plantilla',
  body: 'El documento final respeta el diseño exacto de tu Word — nada se reacomoda.'
}, {
  title: 'Nunca inventa datos',
  body: 'Si falta información, lo dice: "_Pendiente de completar_", en vez de rellenar con algo falso.'
}, {
  title: 'Fotos que se ajustan solas',
  body: 'Cada imagen se acomoda a su espacio sin recortar ni deformar.'
}, {
  title: 'Dictado por voz',
  body: 'Dicta tus notas cuando no quieras escribir — Documa transcribe mientras hablas.'
}];
const FAQS = [{
  q: '¿Necesito reformatear mi plantilla Word?',
  a: 'No. Documa respeta el diseño que ya tiene tu plantilla — solo rellena los campos de texto e imagen.'
}, {
  q: '¿Qué pasa si falta información en mis notas?',
  a: 'Documa lo marca como "_Pendiente de completar_" en el documento, en vez de inventar una respuesta.'
}, {
  q: '¿Puedo dictar por voz?',
  a: 'Sí, si tu navegador lo soporta. Si no, siempre puedes escribir o pegar tus notas directamente.'
}, {
  q: '¿Mis fotos se van a ver cortadas o deformadas?',
  a: 'No. Cada foto se ajusta automáticamente conservando su proporción original.'
}];
const HERO = {
  eyebrow: 'Rellenador de plantillas con IA',
  headline: 'Convierte notas sueltas en documentos listos para enviar',
  subhead: 'Dicta o pega tus notas, sube tus fotos, y Documa reparte todo en tu plantilla Word — sin tocar el formato.',
  ctaPrimary: 'Probar la demo',
  ctaSecondary: 'Ver cómo funciona'
};
function Wordmark() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: 'var(--brand-primary)',
      display: 'inline-block',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--text-primary-dark)'
    }
  }, "Documa"));
}
function NavLink({
  href,
  children
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontSize: 13.5,
      color: hover ? 'var(--brand-primary)' : 'var(--text-secondary-dark)',
      textDecoration: 'none',
      transition: 'color var(--duration-fast) var(--ease-standard)'
    }
  }, children);
}
function NavBar({
  minimal = false
}) {
  const {
    Button
  } = window.DocumaDesignSystem_7668c6;
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 0',
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), !minimal && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(NavLink, {
    href: "#como-funciona"
  }, "C\xF3mo funciona"), /*#__PURE__*/React.createElement(NavLink, {
    href: "#caracteristicas"
  }, "Caracter\xEDsticas"), /*#__PURE__*/React.createElement(NavLink, {
    href: "#faq"
  }, "Preguntas")), /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "compact"
  }, "Probar la demo")));
}
function SectionHead({
  n,
  label,
  heading,
  center = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32,
      textAlign: center ? 'center' : 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
      justifyContent: center ? 'center' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      fontWeight: 700,
      color: 'var(--brand-primary)',
      background: 'var(--brand-primary-wash)',
      borderRadius: 4,
      padding: '3px 7px'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary-dark)'
    }
  }, label)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 28,
      margin: 0,
      color: 'var(--text-primary-dark)'
    }
  }, heading));
}

// The fanned template-stack illustration, reused from the workbench empty state.
function StackIllustration({
  scale = 1
}) {
  const bar = (w, h, color) => ({
    height: h,
    width: w,
    borderRadius: 2,
    background: color
  });
  const sheet = {
    position: 'absolute',
    width: 130,
    height: 168,
    borderRadius: 8,
    top: 0,
    left: 0,
    boxSizing: 'border-box'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 176 * scale,
      height: 198 * scale,
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...sheet,
      background: 'var(--state-pending-bg)',
      border: '1.5px solid var(--accent-warm)',
      transform: 'rotate(-12deg) translate(0px, 12px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sheet,
      background: 'var(--brand-primary-wash)',
      border: '1.5px solid var(--brand-primary)',
      transform: 'rotate(9deg) translate(32px, 8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sheet,
      background: 'var(--surface-paper)',
      border: '1.5px solid var(--text-primary-light)',
      transform: 'translate(16px, 0)',
      boxShadow: '0 10px 24px -8px rgba(20, 22, 29, 0.22)',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bar('68%', 8, 'var(--accent-warm)')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...bar('40%', 7, 'var(--border-hairline-dark)'),
      marginBottom: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('100%', 5, 'var(--border-hairline-dark)')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('86%', 5, 'var(--border-hairline-dark)')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('64%', 5, 'var(--brand-primary)')
  })));
}
function StepColumn({
  step
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--brand-primary)',
      marginBottom: 10
    }
  }, step.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 16,
      marginBottom: 6,
      color: 'var(--text-primary-dark)'
    }
  }, step.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6
    }
  }, step.body));
}
function StepInline({
  step,
  showLine
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      paddingTop: 18
    }
  }, showLine && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 5,
      left: '-50%',
      width: '100%',
      height: 1,
      background: 'var(--border-hairline-dark)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--brand-primary)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--brand-primary)',
      marginBottom: 8
    }
  }, step.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      marginBottom: 5,
      color: 'var(--text-primary-dark)'
    }
  }, step.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6
    }
  }, step.body));
}
function FeatureCard({
  f
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hairline-dark)',
      borderRadius: 'var(--radius-base)',
      padding: '20px 22px',
      background: 'var(--surface-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15.5,
      marginBottom: 7,
      color: 'var(--text-primary-dark)'
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6
    }
  }, f.body));
}
function FeatureListRow({
  f
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: 24,
      padding: '20px 0',
      borderBottom: '1px solid var(--border-hairline-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--text-primary-dark)'
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6
    }
  }, f.body));
}
function FeatureStrip({
  f
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--accent-warm)',
      marginBottom: 6
    }
  }, '{{ }}'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14.5,
      marginBottom: 5,
      color: 'var(--text-primary-dark)'
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.55
    }
  }, f.body));
}
function FaqAccordion({
  items
}) {
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", null, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderBottom: '1px solid var(--border-hairline-dark)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(open === i ? -1 : i),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '18px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--text-primary-dark)'
    }
  }, it.q, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--brand-primary)',
      fontSize: 16
    }
  }, open === i ? '−' : '+')), open === i && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6,
      paddingBottom: 18,
      maxWidth: '68ch'
    }
  }, it.a))));
}
function FaqStatic({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      marginBottom: 5,
      color: 'var(--text-primary-dark)'
    }
  }, it.q), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary-dark)',
      lineHeight: 1.6,
      maxWidth: '68ch'
    }
  }, it.a))));
}
function DemoFrame({
  labelBar = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hairline-dark)',
      borderRadius: 'var(--radius-base)',
      overflow: 'hidden',
      background: 'var(--surface-app)'
    }
  }, labelBar && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px',
      borderBottom: '1px solid var(--border-hairline-dark)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-secondary-dark)'
    }
  }, "documa.app \u2014 demo en vivo"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(window.Workbench, {
    embedded: true
  })));
}
function FinalCta() {
  const {
    Button
  } = window.DocumaDesignSystem_7668c6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--brand-primary)',
      borderRadius: 'var(--radius-base)',
      padding: '48px 40px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      color: '#fff',
      marginBottom: 10
    }
  }, "\xBFListo para probarlo?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.82)',
      marginBottom: 22
    }
  }, "Sin registro. La demo corre completa en esta p\xE1gina."), /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "base"
  }, "Probar la demo")));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-hairline-dark)',
      padding: '28px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary-dark)'
    }
  }, "Rellenador inteligente de plantillas.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-secondary-dark)'
    }
  }, "Texto ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-primary)'
    }
  }, '{{ }}'), " \xB7 Imagen ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-primary)'
    }
  }, '{%% }')));
}
Object.assign(window, {
  STEPS,
  FEATURES,
  FAQS,
  HERO,
  Wordmark,
  NavLink,
  NavBar,
  SectionHead,
  StackIllustration,
  StepColumn,
  StepInline,
  FeatureCard,
  FeatureListRow,
  FeatureStrip,
  FaqAccordion,
  FaqStatic,
  DemoFrame,
  FinalCta,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "exploration/landing/LandingShared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/documa-web/Workbench.jsx
try { (() => {
const {
  Button,
  TemplateCard,
  TextArea,
  MicButton,
  DocSlot,
  ImageSlot,
  ImagePoint,
  LimitNotice
} = window.DocumaDesignSystem_7668c6;
const TEMPLATES = [{
  id: 'informe',
  name: 'Informe de actividad',
  org: 'Reporte periódico interno',
  title: 'Informe de Actividad',
  slots: [{
    key: 'objetivo',
    label: 'Objetivo del periodo'
  }, {
    key: 'actividades',
    label: 'Actividades realizadas'
  }, {
    key: 'resultados',
    label: 'Resultados obtenidos'
  }, {
    key: 'pendientes',
    label: 'Pendientes'
  }],
  imageSlots: [{
    key: 'foto_evidencia',
    label: 'Foto de evidencia',
    caption: 'Evidencia de la actividad'
  }],
  example: 'esta semana el foco era mejorar los tiempos de atención al cliente. armamos un nuevo sistema de tickets y capacitamos al equipo de soporte el jueves. el tiempo de respuesta bajó bastante, de casi 2 días a unas 4 horas. falta todavía documentar el proceso nuevo y hacer seguimiento el próximo mes.',
  answers: {
    objetivo: 'Mejorar los tiempos de atención al cliente durante el periodo.',
    actividades: 'Se implementó un nuevo sistema de tickets y se capacitó al equipo de soporte el jueves.',
    resultados: 'El tiempo de respuesta se redujo de casi 2 días a aproximadamente 4 horas.',
    pendientes: '_Pendiente de completar_'
  }
}, {
  id: 'acta',
  name: 'Acta de reunión',
  org: 'Minuta de reunión',
  title: 'Acta de Reunión',
  slots: [{
    key: 'asistentes',
    label: 'Asistentes'
  }, {
    key: 'temas',
    label: 'Temas tratados'
  }, {
    key: 'acuerdos',
    label: 'Acuerdos'
  }, {
    key: 'proxima',
    label: 'Próxima reunión'
  }],
  imageSlots: [{
    key: 'foto_pizarra',
    label: 'Foto de la pizarra',
    caption: 'Registro de la sesión'
  }],
  example: 'estuvimos ana, el jefe de ventas y yo. se habló del presupuesto del trimestre y de la campaña de fin de año. quedamos en que ana manda la propuesta el viernes y que aprobamos el gasto de publicidad. nos volvemos a juntar en dos semanas.',
  answers: {
    asistentes: 'Ana, el jefe de ventas y el solicitante.',
    temas: 'Presupuesto del trimestre y campaña de fin de año.',
    acuerdos: 'Ana enviará la propuesta el viernes; se aprueba el gasto de publicidad.',
    proxima: 'En dos semanas.'
  }
}, {
  id: 'propuesta',
  name: 'Propuesta de proyecto',
  org: 'Documento de propuesta',
  title: 'Propuesta de Proyecto',
  slots: [{
    key: 'problema',
    label: 'Problema a resolver'
  }, {
    key: 'solucion',
    label: 'Solución propuesta'
  }, {
    key: 'alcance',
    label: 'Alcance'
  }, {
    key: 'beneficios',
    label: 'Beneficios esperados'
  }],
  imageSlots: [{
    key: 'diagrama',
    label: 'Diagrama de la solución',
    caption: 'Esquema propuesto'
  }, {
    key: 'logo',
    label: 'Logo o portada',
    caption: 'Identidad del proyecto'
  }],
  example: 'el problema es que perdemos mucho tiempo llenando los mismos formularios a mano. la idea es una herramienta que reparta el texto automáticamente con IA en las plantillas. por ahora solo documentos word, no todo el sistema. esperamos ahorrar varias horas por semana y reducir errores de tipeo.',
  answers: {
    problema: 'Se pierde mucho tiempo llenando manualmente los mismos formularios.',
    solucion: 'Una herramienta que reparte texto libre automáticamente con IA en plantillas Word.',
    alcance: 'Documentos Word únicamente; no cubre todo el sistema.',
    beneficios: 'Ahorro de varias horas por semana y menos errores de tipeo.'
  }
}];

// Empty-state mockup: a literal small "paper" with a folded corner (pure CSS
// — a bg-colored triangle over the corner) and a few muted text bars, rather
// than skeleton bars scattered across the whole panel. Reads as "your
// document will look like this" instead of dead whitespace.
function PaperPreview() {
  const bar = (w, h = 5, color = 'var(--border-hairline-dark)') => ({
    height: h,
    width: w,
    borderRadius: 2,
    background: color
  });
  const sheet = {
    position: 'absolute',
    width: 130,
    height: 168,
    borderRadius: 8,
    top: 0,
    left: 0,
    boxSizing: 'border-box'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 26,
      minHeight: 320
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 176,
      height: 198
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...sheet,
      background: 'var(--state-pending-bg)',
      border: '1.5px solid var(--accent-warm)',
      transform: 'rotate(-12deg) translate(0px, 12px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sheet,
      background: 'var(--brand-primary-wash)',
      border: '1.5px solid var(--brand-primary)',
      transform: 'rotate(9deg) translate(32px, 8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...sheet,
      background: 'var(--surface-paper)',
      border: '1.5px solid var(--text-primary-light)',
      transform: 'translate(16px, 0)',
      boxShadow: '0 10px 24px -8px rgba(20, 22, 29, 0.22)',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bar('68%', 8, 'var(--accent-warm)')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...bar('40%', 7),
      marginBottom: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('100%')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('86%')
  }), /*#__PURE__*/React.createElement("div", {
    style: bar('64%', 5, 'var(--brand-primary)')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary-light)',
      textAlign: 'center',
      maxWidth: 230,
      lineHeight: 1.5
    }
  }, "Elige una plantilla y genera para ver tu documento rellenado aqu\xED"));
}
function PanelEyebrow({
  n,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      fontWeight: 700,
      color: 'var(--brand-primary)',
      background: 'var(--brand-primary-wash)',
      borderRadius: 4,
      padding: '3px 7px'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary-dark)'
    }
  }, label));
}
function Field({
  cap,
  sub,
  right,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-primary-dark)',
      fontWeight: 500
    }
  }, cap, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary-dark)',
      fontWeight: 400
    }
  }, "\u2014 ", sub)), right), children);
}
function Workbench({
  embedded = false
} = {}) {
  const [selected, setSelected] = React.useState(TEMPLATES[0]);
  const [notes, setNotes] = React.useState('');
  const [images, setImages] = React.useState({});
  const [remaining, setRemaining] = React.useState(3);
  const [busy, setBusy] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const [slotState, setSlotState] = React.useState({});
  const [slotText, setSlotText] = React.useState({});
  const speechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  function selectTemplate(t) {
    if (busy) return;
    setSelected(t);
    setImages({});
    setGenerated(false);
    setSlotState({});
  }
  function pickImage(key) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setImages(p => ({
        ...p,
        [key]: reader.result
      }));
      reader.readAsDataURL(file);
    };
    input.click();
  }
  async function generate() {
    if (busy || remaining <= 0) return;
    setBusy(true);
    setGenerated(true);
    const initial = {};
    selected.slots.forEach(s => initial[s.key] = 'empty');
    setSlotState(initial);
    setSlotText({});
    for (const s of selected.slots) {
      setSlotState(p => ({
        ...p,
        [s.key]: 'filling'
      }));
      await new Promise(r => setTimeout(r, 450));
      const answer = selected.answers[s.key];
      setSlotText(p => ({
        ...p,
        [s.key]: answer
      }));
      setSlotState(p => ({
        ...p,
        [s.key]: answer === '_Pendiente de completar_' ? 'pending' : 'filled'
      }));
      await new Promise(r => setTimeout(r, 180));
    }
    setRemaining(r => r - 1);
    setBusy(false);
  }
  function resetDemo() {
    setRemaining(3);
    setImages({});
    setGenerated(false);
    setSlotState({});
    setSlotText({});
    setNotes('');
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: embedded ? 'transparent' : 'var(--surface-app)',
      minHeight: embedded ? 'auto' : '100vh',
      padding: embedded ? '0' : '40px 32px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24,
      paddingBottom: 28,
      marginBottom: 32,
      borderBottom: '1px solid var(--border-hairline-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--brand-primary)',
      marginBottom: 9
    }
  }, "Rellenador de plantillas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: 'var(--brand-primary)',
      display: 'inline-block',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 31,
      letterSpacing: '-0.01em',
      color: 'var(--text-primary-dark)',
      margin: 0
    }
  }, "Documa")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      border: '1px solid var(--border-hairline-dark)',
      borderRadius: 'var(--radius-base)',
      padding: '26px 26px 28px'
    }
  }, /*#__PURE__*/React.createElement(PanelEyebrow, {
    n: "01",
    label: "Entrada"
  }), /*#__PURE__*/React.createElement(Field, {
    cap: "Plantilla",
    sub: "elige el formato a rellenar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, TEMPLATES.map(t => /*#__PURE__*/React.createElement(TemplateCard, {
    key: t.id,
    name: t.name,
    textSlots: t.slots.map(s => s.key),
    imageSlots: t.imageSlots.map(s => s.key),
    active: t.id === selected.id,
    onClick: () => selectTemplate(t)
  })))), /*#__PURE__*/React.createElement(Field, {
    cap: "Notas en crudo",
    sub: "dicta o escribe",
    right: /*#__PURE__*/React.createElement(MicButton, {
      recording: recording,
      supported: speechSupported,
      onClick: () => setRecording(r => !r)
    })
  }, /*#__PURE__*/React.createElement(TextArea, {
    value: notes,
    onChange: setNotes,
    listening: recording,
    placeholder: "Ej: reuni\xF3n con proveedor el martes, hablamos de bajar costos de log\xEDstica...",
    minHeight: 128
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setNotes(selected.example),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--brand-primary-hover)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: 0,
      marginTop: 8
    }
  }, "cargar ejemplo \u2192")), selected.imageSlots.length > 0 && /*#__PURE__*/React.createElement(Field, {
    cap: "Fotos",
    sub: "para los puntos de imagen de la plantilla"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, selected.imageSlots.map(s => /*#__PURE__*/React.createElement(ImagePoint, {
    key: s.key,
    token: s.key,
    label: s.label,
    thumbSrc: images[s.key],
    onPick: () => pickImage(s.key)
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    disabled: busy || remaining <= 0,
    onClick: generate
  }, remaining <= 0 ? 'Límite de demo alcanzado' : busy ? 'Repartiendo con IA…' : 'Repartir y generar documento'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(LimitNotice, {
    visible: remaining <= 0,
    title: "Llegaste al l\xEDmite de la demo",
    description: "Esta demo permite 3 generaciones. En el producto completo esto es ilimitado y el documento conserva el formato exacto de tu plantilla Word.",
    onReset: resetDemo
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-paper)',
      border: '1px solid var(--border-hairline-dark)',
      borderRadius: 'var(--radius-base)',
      padding: '28px 32px 30px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(PanelEyebrow, {
    n: "02",
    label: "Documento"
  }), !generated ? /*#__PURE__*/React.createElement(PaperPreview, null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '2px solid var(--text-primary-light)',
      paddingBottom: 10,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary-light)'
    }
  }, selected.org), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 700,
      marginTop: 4
    }
  }, selected.title)), selected.slots.map(s => /*#__PURE__*/React.createElement(DocSlot, {
    key: s.key,
    label: s.label,
    token: s.key,
    state: slotState[s.key] || 'empty'
  }, slotText[s.key])), selected.imageSlots.map(s => /*#__PURE__*/React.createElement(ImageSlot, {
    key: s.key,
    label: s.label,
    token: s.key,
    src: images[s.key],
    caption: s.caption
  })), !busy && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "compact"
  }, "Descargar documento"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "compact",
    onClick: () => setGenerated(false)
  }, "Editar y regenerar"))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      marginTop: 28,
      paddingTop: 16,
      borderTop: '1px solid var(--border-hairline-dark)',
      fontSize: 11.5,
      color: 'var(--text-secondary-dark)',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Texto: reparto y redacci\xF3n reales con IA \xB7 Fotos: ajuste autom\xE1tico conservando proporci\xF3n"), /*#__PURE__*/React.createElement("span", null, "Texto ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--brand-primary)'
    }
  }, '{{ }}'), " \xB7 Imagen", ' ', /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--brand-primary)'
    }
  }, '{%% }')))));
}
window.Workbench = Workbench;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/documa-web/Workbench.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TemplateCard = __ds_scope.TemplateCard;

__ds_ns.DocSlot = __ds_scope.DocSlot;

__ds_ns.ImagePoint = __ds_scope.ImagePoint;

__ds_ns.ImageSlot = __ds_scope.ImageSlot;

__ds_ns.LimitNotice = __ds_scope.LimitNotice;

__ds_ns.StampCounter = __ds_scope.StampCounter;

__ds_ns.Dropzone = __ds_scope.Dropzone;

__ds_ns.MicButton = __ds_scope.MicButton;

__ds_ns.TextArea = __ds_scope.TextArea;

})();
