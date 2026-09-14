import pytest
from app.models.domain import Document, DocumentChunk, KnowledgeSource


def test_rag_document_chunking():
    doc = Document(title='UltraTech Kiln Technical Spec', category='TECHNICAL_SPEC', source_name='UltraTech', content_text='Amine capture system with 98.5% purity.')
    chunk = DocumentChunk(document_id=1, chunk_index=0, chunk_text='Amine capture system with 98.5% purity.')
    ks = KnowledgeSource(name='IEA CCUS Roadmap 2026', category='RESEARCH_PAPER', is_verified=True)

    assert doc.category == 'TECHNICAL_SPEC'
    assert chunk.chunk_index == 0
    assert ks.is_verified is True
