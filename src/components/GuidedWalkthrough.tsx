import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import type { Walkthrough } from "../types";

type GuidedWalkthroughProps = {
	walkthrough?: Walkthrough;
	onStepSelect?: (t?: number, eventId?: string) => void;
};

export function GuidedWalkthrough({ walkthrough, onStepSelect }: GuidedWalkthroughProps) {
	const [stepIndex, setStepIndex] = useState(0);
	const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
	const [showQuizResult, setShowQuizResult] = useState(false);

	if (!walkthrough || walkthrough.steps.length === 0) {
		return (
			<article className="card visual" data-testid="guided-walkthrough-view">
				<div className="panel-heading">
					<div>
						<p className="eyebrow">Guided walkthrough</p>
						<h3>No Walkthrough Available</h3>
						<p>There is no step-by-step walkthrough configured for this protocol definition yet.</p>
					</div>
				</div>
			</article>
		);
	}

	const currentStep = walkthrough.steps[stepIndex];
	const totalSteps = walkthrough.steps.length;
	const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

	function goToStep(idx: number) {
		const steps = walkthrough?.steps || [];
		const target = Math.max(0, Math.min(steps.length - 1, idx));
		setStepIndex(target);
		setQuizAnswer(null);
		setShowQuizResult(false);
		if (steps[target] && onStepSelect) {
			onStepSelect(steps[target].t, steps[target].eventId);
		}
	}

	return (
		<article className="card visual" data-testid="guided-walkthrough-view">
			<div className="panel-heading">
				<div>
					<p className="eyebrow">Guided walkthrough</p>
					<h3>{walkthrough.title}</h3>
					<p>{walkthrough.description}</p>
				</div>
			</div>

			<div className="walkthrough-card-body">
				<div className="walkthrough-step-header">
					<h4>{currentStep.title}</h4>
					{currentStep.t !== undefined && <span className="mono status info">t={currentStep.t}</span>}
				</div>

				<div className="explanation-callout">
					<strong>Narrative:</strong>
					<p>{currentStep.narrative}</p>
				</div>

				<div className="explanation-why">
					<strong>Why does this matter?</strong>
					<p>{currentStep.whyItMatters}</p>
				</div>

				{currentStep.quiz && (
					<div className="quiz-container">
						<div className="quiz-header">
							<HelpCircle size={16} />
							<strong>Comprehension Check</strong>
						</div>
						<p className="quiz-question">{currentStep.quiz.question}</p>
						<div className="quiz-options">
							{currentStep.quiz.options.map((opt, i) => (
								<button
									key={i}
									className={`quiz-opt-btn ${quizAnswer === i ? "selected" : ""}`}
									onClick={() => {
										setQuizAnswer(i);
										setShowQuizResult(true);
									}}
								>
									{opt}
								</button>
							))}
						</div>
						{showQuizResult && (
							<div
								className={`quiz-feedback ${
									quizAnswer === currentStep.quiz?.correctIndex ? "success" : "warning"
								}`}
							>
								{quizAnswer === currentStep.quiz?.correctIndex ? (
									<span>
										<CheckCircle size={14} /> Correct! {currentStep.quiz.explanation}
									</span>
								) : (
									<span>Incorrect. {currentStep.quiz?.explanation}</span>
								)}
							</div>
						)}
					</div>
				)}

				<div className="walkthrough">
					<button
						className="button"
						disabled={stepIndex === 0}
						onClick={() => goToStep(stepIndex - 1)}
					>
						<ChevronLeft size={16} /> Prev
					</button>

					<div
						className="progress"
						role="progressbar"
						aria-label="Walkthrough progress"
						aria-valuenow={progressPercent}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<i style={{ width: `${progressPercent}%` }} />
					</div>

					<span className="step-count">
						{stepIndex + 1} of {totalSteps}
					</span>

					<button
						className="button primary"
						disabled={stepIndex === totalSteps - 1}
						onClick={() => goToStep(stepIndex + 1)}
					>
						Next <ChevronRight size={16} />
					</button>
				</div>
			</div>
		</article>
	);
}
