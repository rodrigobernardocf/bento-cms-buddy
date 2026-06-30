DO $$
DECLARE
  _author_id UUID;
BEGIN
  -- Usa o primeiro perfil cadastrado (admin / Dr. JP)
  SELECT id INTO _author_id FROM public.profiles ORDER BY created_at LIMIT 1;

  IF _author_id IS NULL THEN
    RAISE NOTICE 'Nenhum perfil encontrado — post não inserido.';
    RETURN;
  END IF;

  INSERT INTO public.posts (
    title,
    slug,
    excerpt,
    content,
    status,
    author_id,
    published_at
  )
  VALUES (
    'Os 4 sinais vitais que decidem se sua reabilitação dura 10 anos ou retorna em 10 meses',
    'sinais-vitais-reabilitacao-oral',
    '90% das falhas em reabilitação oral indireta não vêm de técnica mal executada. Vêm do diagnóstico e da seleção de caso. Existem quatro sinais vitais que sustentam essa diferença: dimensão vertical, relação cêntrica, estabilidade oclusal e guias de desoclusão.',
    '90% das falhas em reabilitação oral indireta não vêm de técnica mal executada. Vêm do diagnóstico e da seleção de caso. A técnica, mesmo a sua, bem conduzida, responde por uma fatia pequena do problema. O resto é o que você deixou de checar antes de montar o plano.

Existem quatro sinais vitais que sustentam essa diferença: dimensão vertical, relação cêntrica, estabilidade oclusal e guias de desoclusão. Quando os quatro estão presentes, o caso tem previsibilidade. Quando um falha — mesmo sem o paciente sentir nada — você já está operando sobre uma base que vai cobrar a conta depois, geralmente como retrabalho, manchamento de interface ou descolamento.

Dimensão vertical. Sem aferi-la, você não consegue diferenciar manejo de dentes anteriores de tentativa às cegas, nem identificar a causa real de falhas recorrentes em restaurações já existentes. Reduzida, ela não fica restrita ao dente: gera sobrecarga articular (fator etiológico direto de deslocamento de disco) e hipertrofia muscular, pela redução do espaço livre funcional e do tempo de descanso da musculatura mastigatória.

Relação cêntrica. É a referência que torna seu planejamento reproduzível. Sem ela documentada, qualquer plano cronológico vira improviso — você está sempre reagindo ao que o caso mostra, nunca antecipando.

Estabilidade oclusal. Estratégias restauradoras só deveriam ser definidas depois que a dimensão apropriada está determinada. Inverter essa ordem é uma das causas mais comuns de retorno do caso meses depois — não por falha de execução, por falha de sequência.

Guias de desoclusão. Posições atípicas aqui não geram sintoma imediato. Geram, anos depois, quadros de disfunção de resolução complexa — e como o paciente não cobra isso na primeira consulta, é o sinal mais negligenciado dos quatro.

Tem uma frase que resume isso melhor do que qualquer protocolo: o melhor piloto não é o que faz as manobras mais arriscadas, é o que decola o mesmo número de vezes que aterrissa. Sucesso em reabilitação não é o caso que impressiona na entrega. É o caso que você não precisa resgatar depois.

Checar os 4 sinais vitais antes de qualquer plano de tratamento é a diferença entre conduzir um caso e gerir uma crise que ainda não aconteceu.',
    'published',
    _author_id,
    now()
  )
  ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE 'Post sinais-vitais-reabilitacao-oral inserido (ou já existia).';
END $$;
