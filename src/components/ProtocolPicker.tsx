import { FileJson, GitBranch } from "lucide-react";
import type { ProtocolDefinition } from "../types";

type ProtocolPickerProps = {
	protocols: ProtocolDefinition[];
	selectedId: string;
	onSelect: (protocolId: string) => void;
};

export function ProtocolPicker({ protocols, selectedId, onSelect }: ProtocolPickerProps) {
	return (
		<label className="protocol-picker">
			<span>
				<FileJson size={16} />
				Protocol
			</span>
			<select value={selectedId} onChange={(event) => onSelect(event.target.value)} data-testid="protocol-picker">
				{protocols.map((protocol) => (
					<option key={protocol.id} value={protocol.id}>
						{protocol.name}
					</option>
				))}
			</select>
			<GitBranch size={16} aria-hidden="true" />
		</label>
	);
}
