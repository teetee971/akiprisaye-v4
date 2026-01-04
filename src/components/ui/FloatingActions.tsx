import AssistantChatButton from "../AssistantChat";
import PanierButton from "../TiPanierButton";

/**
 * FloatingActions - Unified container for floating action buttons
 * Prevents overlap on mobile by stacking chat and cart buttons vertically
 */
export default function FloatingActions() {
  return (
    <div className="floating-actions">
      <AssistantChatButton />
      <PanierButton />
    </div>
  );
}
