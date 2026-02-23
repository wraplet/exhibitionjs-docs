import React, {Component, ReactNode} from "react";
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
// @ts-ignore
const {motion} = ExecutionEnvironment.canUseDOM ? require("framer-motion") : { motion: { div: (props) => <div {...props} /> } };

interface Props {
  title?: string;
  children?: ReactNode;
  onClick?: () => void;
}

interface State {
  open: boolean;
}

export default class ExampleModal extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleEscape = this.handleEscape.bind(this);
  }

  handleEscape(e) {
    if (e.key === 'Escape' && this.state.open) {
      this.setState({open: false});
    }
  }

  componentDidMount() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    document.addEventListener('keydown', this.handleEscape);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    if (this.state.open !== prevState.open) {
      if (this.state.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  componentWillUnmount() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = '';
  }

  setOpen(open) {
    if (open && this.props.onClick) {
        this.props.onClick();
    }
    this.setState({open});
  }

  render() {
    const {title, children} = this.props;
    const {open} = this.state;

    return (
      <>
        <div className="text--center">
          <button className="button button--primary" onClick={() => this.setOpen(true)}>
            Open in modal
          </button>
        </div>

        {/* Modal - always rendered, visibility controlled by CSS */}
        <div
          className="modal-container"
          style={{
            visibility: open ? 'visible' : 'hidden',
            pointerEvents: open ? 'auto' : 'none'
          }}
          aria-hidden={!open}
        >
          {/* Overlay */}
          <motion.div
            className="modal-overlay"
            onClick={() => this.setOpen(false)}
            initial={false}
            animate={{opacity: open ? 1 : 0}}
            transition={{duration: 0.25}}
          />

          {/* Modal wrapper (centered container) */}
          <div className="modal-wrapper" onClick={() => this.setOpen(false)}>
            <motion.div
              className="modal-panel"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              initial={false}
              animate={{
                opacity: open ? 1 : 0,
                scale: open ? 1 : 0.95,
                y: open ? 0 : 10
              }}
              transition={{duration: 0.25, ease: "easeOut"}}
            >
              {title && (
                <h2 className="modal-title">
                  {title}
                </h2>
              )}

              {/* Children are ALWAYS rendered */}
              {children}

              <button
                className="button button--secondary"
                style={{marginTop: '1rem'}}
                onClick={() => this.setOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </div>
        </div>

        <style>{`
                .modal-container {
                    position: fixed;
                    inset: 0;
                    z-index: 1000;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                }

                [data-theme='dark'] .modal-overlay {
                    background: rgba(0, 0, 0, 0.7);
                }

                .modal-wrapper {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                    padding: 1rem;
                }

                .modal-panel {
                    background: var(--ifm-background-surface-color);
                    color: var(--ifm-font-color-base);
                    border-radius: 0.75rem;
                    box-shadow: var(--ifm-global-shadow-md);
                    padding: 2rem;
                    max-width: 800px;
                    width: 100%;
                    position: relative;
                    border: 1px solid var(--ifm-color-emphasis-200);
                    height: 100%;
                }

                [data-theme='dark'] .modal-panel {
                    border-color: var(--ifm-color-emphasis-300);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                
                .modal-panel > * {
                    width: 100%;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: var(--ifm-heading-color);
                }

                .modal-description {
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }
            `}</style>
      </>
    );
  }
}