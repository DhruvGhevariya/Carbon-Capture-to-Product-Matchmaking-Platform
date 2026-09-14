import pytest
from app.core.state_machines import validate_order_transition, validate_project_transition
from app.core.exceptions import StateTransitionError


def test_order_state_machine_valid():
    assert validate_order_transition('DRAFT', 'PENDING_CONFIRMATION') is True
    assert validate_order_transition('PENDING_CONFIRMATION', 'CONFIRMED') is True
    assert validate_order_transition('CONFIRMED', 'IN_PROGRESS') is True
    assert validate_order_transition('IN_PROGRESS', 'FULFILLED') is True


def test_order_state_machine_invalid():
    with pytest.raises(StateTransitionError):
        validate_order_transition('DRAFT', 'FULFILLED')

    with pytest.raises(StateTransitionError):
        validate_order_transition('FULFILLED', 'CONFIRMED')


def test_project_state_machine_valid():
    assert validate_project_transition('DRAFT', 'PROPOSED') is True
    assert validate_project_transition('ACTIVE', 'PAUSED') is True
    assert validate_project_transition('PAUSED', 'ACTIVE') is True
    assert validate_project_transition('ACTIVE', 'COMPLETED') is True


def test_project_state_machine_invalid():
    with pytest.raises(StateTransitionError):
        validate_project_transition('DRAFT', 'COMPLETED')

    with pytest.raises(StateTransitionError):
        validate_project_transition('COMPLETED', 'ACTIVE')
