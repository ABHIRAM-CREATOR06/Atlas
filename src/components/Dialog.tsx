import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type DialogProps = {
	open: boolean;
	titleId: string;
	descriptionId?: string;
	initialFocusRef?: React.RefObject<HTMLElement | null>;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
};

const FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const Dialog: React.FC<DialogProps> = ({
	open,
	titleId,
	descriptionId,
	initialFocusRef,
	onClose,
	children,
	className = "",
}) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!open) return;

		// Save trigger element for focus restoration
		previousActiveElement.current = document.activeElement as HTMLElement;

		const dialogNode = dialogRef.current;
		if (dialogNode) {
			// Focus initial element or first focusable element
			if (initialFocusRef && initialFocusRef.current) {
				initialFocusRef.current.focus();
			} else {
				const focusables = dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
				const firstFocusable = Array.from(focusables).find(
					(el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
				);
				if (firstFocusable) {
					firstFocusable.focus();
				} else {
					dialogNode.focus();
				}
			}
		}

		// Keyboard handlers (Tab trap & Escape key)
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				onClose();
				return;
			}

			if (e.key === "Tab" && dialogNode) {
				const focusables = Array.from(
					dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
				).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

				if (focusables.length === 0) {
					e.preventDefault();
					return;
				}

				const firstElement = focusables[0];
				const lastElement = focusables[focusables.length - 1];

				if (e.shiftKey) {
					if (document.activeElement === firstElement || document.activeElement === dialogNode) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown, true);

		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);

			// Restore focus on close
			if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
				// Use setTimeout to ensure unmount completes
				setTimeout(() => {
					if (document.body.contains(previousActiveElement.current)) {
						previousActiveElement.current?.focus();
					}
				}, 0);
			}
		};
	}, [open, onClose, initialFocusRef]);

	if (!open) return null;

	const modalContent = (
		<div
			className="dialog-backdrop"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			style={{
				position: "fixed",
				inset: 0,
				backgroundColor: "rgba(0, 0, 0, 0.65)",
				backdropFilter: "blur(4px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
				padding: "1rem",
			}}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				tabIndex={-1}
				data-testid="modal-dialog"
				className={`dialog-content ${className}`}
				style={{
					outline: "none",
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflowY: "auto",
				}}
			>
				{children}
			</div>
		</div>
	);

	return createPortal(modalContent, document.body);
};
