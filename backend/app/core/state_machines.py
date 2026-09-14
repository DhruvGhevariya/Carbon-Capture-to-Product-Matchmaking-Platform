from typing import Set, Dict
from app.core.exceptions import StateTransitionError

ORDER_TRANSITIONS: Dict[str, Set[str]] = {
    'DRAFT': {'PENDING_CONFIRMATION', 'CANCELLED'},
    'PENDING_CONFIRMATION': {'CONFIRMED', 'CANCELLED'},
    'CONFIRMED': {'IN_PROGRESS', 'CANCELLED'},
    'IN_PROGRESS': {'FULFILLED', 'CANCELLED'},
    'FULFILLED': set(),
    'CANCELLED': set(),
}

PROJECT_TRANSITIONS: Dict[str, Set[str]] = {
    'DRAFT': {'PROPOSED', 'CANCELLED'},
    'PROPOSED': {'UNDER_REVIEW', 'CANCELLED'},
    'UNDER_REVIEW': {'TECHNICAL_VALIDATION', 'CANCELLED'},
    'TECHNICAL_VALIDATION': {'COMMERCIAL_NEGOTIATION', 'CANCELLED'},
    'COMMERCIAL_NEGOTIATION': {'ACTIVE', 'CANCELLED'},
    'ACTIVE': {'PAUSED', 'COMPLETED', 'CANCELLED'},
    'PAUSED': {'ACTIVE', 'CANCELLED'},
    'COMPLETED': set(),
    'CANCELLED': set(),
}


def validate_order_transition(current_state: str, target_state: str) -> bool:
    curr = current_state.upper()
    tgt = target_state.upper()
    if curr == tgt:
        return True
    allowed = ORDER_TRANSITIONS.get(curr, set())
    if tgt not in allowed:
        raise StateTransitionError(curr, tgt, list(allowed))
    return True


def validate_project_transition(current_state: str, target_state: str) -> bool:
    curr = current_state.upper()
    tgt = target_state.upper()
    if curr == tgt:
        return True
    allowed = PROJECT_TRANSITIONS.get(curr, set())
    if tgt not in allowed:
        raise StateTransitionError(curr, tgt, list(allowed))
    return True
