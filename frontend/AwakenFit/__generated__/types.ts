export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
};

export type ExerciseCreateCompletedInput = {
  intensity?: InputMaybe<Scalars['Int']['input']>;
  movementId: Scalars['ID']['input'];
  nonStandardSets?: InputMaybe<Array<InputMaybe<SetCreateCompletedParentInput>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  standardSets?: InputMaybe<Array<InputMaybe<SetCreateCompletedInput>>>;
};

export type ExerciseCreateTemplateInput = {
  intensity?: InputMaybe<Scalars['Int']['input']>;
  movementId: Scalars['ID']['input'];
  nonStandardSets?: InputMaybe<Array<InputMaybe<SetCreateTemplateParentInput>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  standardSets?: InputMaybe<Array<InputMaybe<SetCreateTemplateInput>>>;
};

export type ExerciseNode = Node & {
  __typename?: 'ExerciseNode';
  /** The ID of the object */
  id: Scalars['ID']['output'];
  intensity: Scalars['Int']['output'];
  movement: MovementNode;
  notes: Scalars['String']['output'];
  sets?: Maybe<Array<Maybe<SetNode>>>;
  workout: WorkoutNode;
};

export type ExerciseNodeConnection = {
  __typename?: 'ExerciseNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ExerciseNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ExerciseNode` and its cursor. */
export type ExerciseNodeEdge = {
  __typename?: 'ExerciseNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ExerciseNode>;
};

export type MessageNode = {
  __typename?: 'MessageNode';
  message?: Maybe<Scalars['String']['output']>;
};

export type MovementNode = Node & {
  __typename?: 'MovementNode';
  description: Scalars['String']['output'];
  equipmentType: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  movementType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  primaryMuscleGroup: Scalars['String']['output'];
  secondaryMuscleGroup: Scalars['String']['output'];
};

export type MovementNodeConnection = {
  __typename?: 'MovementNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<MovementNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `MovementNode` and its cursor. */
export type MovementNodeEdge = {
  __typename?: 'MovementNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<MovementNode>;
};

export type Mutation = {
  __typename?: 'Mutation';
  workoutCreateCompleted?: Maybe<WorkoutCreateCompleted>;
  workoutCreateTemplate?: Maybe<WorkoutCreateTemplate>;
};


export type MutationWorkoutCreateCompletedArgs = {
  input: WorkoutCreateCompletedInput;
};


export type MutationWorkoutCreateTemplateArgs = {
  input: WorkoutCreateTemplateInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  exercise?: Maybe<ExerciseNode>;
  exercises?: Maybe<ExerciseNodeConnection>;
  movement?: Maybe<MovementNode>;
  movements?: Maybe<MovementNodeConnection>;
  set?: Maybe<SetNode>;
  sets?: Maybe<SetNodeConnection>;
  weekInReview?: Maybe<WeekInReview>;
  workout?: Maybe<WorkoutNode>;
  workouts?: Maybe<WorkoutNodeConnection>;
};


export type QueryExerciseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExercisesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  movementId?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMovementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMovementsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  equipmentType?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  movementType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  name_Istartswith?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  primaryMuscleGroup?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySetArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryWorkoutArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWorkoutsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startMonth?: InputMaybe<Scalars['Decimal']['input']>;
  startYear?: InputMaybe<Scalars['Decimal']['input']>;
  template?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SetCreateCompletedInput = {
  completedReps?: InputMaybe<Scalars['Int']['input']>;
  duration?: InputMaybe<Scalars['String']['input']>;
  equipmentIdentifier?: InputMaybe<Scalars['String']['input']>;
  sequenceNumber: Scalars['Int']['input'];
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type SetCreateCompletedParentInput = {
  associatedSets: Array<InputMaybe<SetCreateCompletedInput>>;
  setType: Scalars['String']['input'];
};

export type SetCreateTemplateInput = {
  duration?: InputMaybe<Scalars['String']['input']>;
  maxReps?: InputMaybe<Scalars['Int']['input']>;
  minReps?: InputMaybe<Scalars['Int']['input']>;
  sequenceNumber: Scalars['Int']['input'];
};

export type SetCreateTemplateParentInput = {
  associatedSets: Array<InputMaybe<SetCreateTemplateInput>>;
  setType: Scalars['String']['input'];
};

export type SetNode = Node & {
  __typename?: 'SetNode';
  completedReps: Scalars['Int']['output'];
  duration: Scalars['String']['output'];
  equipmentIdentifier: Scalars['String']['output'];
  exercise?: Maybe<ExerciseNode>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  maxReps: Scalars['Int']['output'];
  minReps: Scalars['Int']['output'];
  oneRepMax?: Maybe<Scalars['Int']['output']>;
  parentSet?: Maybe<SetNode>;
  sequenceNumber: Scalars['Int']['output'];
  setType: Scalars['String']['output'];
  volume?: Maybe<Scalars['Int']['output']>;
  weight: Scalars['Int']['output'];
};

export type SetNodeConnection = {
  __typename?: 'SetNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SetNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SetNode` and its cursor. */
export type SetNodeEdge = {
  __typename?: 'SetNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<SetNode>;
};

export type WeekInReview = {
  __typename?: 'WeekInReview';
  favoriteEquipment?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  topMuscleGroup?: Maybe<Scalars['String']['output']>;
  totalCardio?: Maybe<Scalars['String']['output']>;
  totalVolume?: Maybe<Scalars['String']['output']>;
  totalWorkouts?: Maybe<Scalars['Int']['output']>;
};

export type WorkoutCreateCompleted = {
  __typename?: 'WorkoutCreateCompleted';
  errors?: Maybe<Array<Maybe<MessageNode>>>;
  workout?: Maybe<WorkoutNode>;
};

export type WorkoutCreateCompletedInput = {
  exercises: Array<InputMaybe<ExerciseCreateCompletedInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  startTime: Scalars['DateTime']['input'];
  stopTime: Scalars['DateTime']['input'];
};

export type WorkoutCreateTemplate = {
  __typename?: 'WorkoutCreateTemplate';
  errors?: Maybe<Array<Maybe<MessageNode>>>;
  workout?: Maybe<WorkoutNode>;
};

export type WorkoutCreateTemplateInput = {
  exercises: Array<InputMaybe<ExerciseCreateTemplateInput>>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type WorkoutNode = Node & {
  __typename?: 'WorkoutNode';
  exercises?: Maybe<Array<Maybe<ExerciseNode>>>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
  stopTime: Scalars['DateTime']['output'];
  template: Scalars['Boolean']['output'];
};

export type WorkoutNodeConnection = {
  __typename?: 'WorkoutNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<WorkoutNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `WorkoutNode` and its cursor. */
export type WorkoutNodeEdge = {
  __typename?: 'WorkoutNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<WorkoutNode>;
};

export type WorkoutCreateTemplateMutationVariables = Exact<{
  input: WorkoutCreateTemplateInput;
}>;


export type WorkoutCreateTemplateMutation = { __typename?: 'Mutation', workoutCreateTemplate?: { __typename?: 'WorkoutCreateTemplate', workout?: { __typename?: 'WorkoutNode', id: string } | null, errors?: Array<{ __typename?: 'MessageNode', message?: string | null } | null> | null } | null };

export type GetWorkoutQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWorkoutQuery = { __typename?: 'Query', workout?: { __typename?: 'WorkoutNode', id: string, name: string, notes: string, exercises?: Array<{ __typename?: 'ExerciseNode', id: string, notes: string, movement: { __typename?: 'MovementNode', id: string, name: string, description: string, primaryMuscleGroup: string, equipmentType: string, movementType: string }, sets?: Array<{ __typename?: 'SetNode', id: string, sequenceNumber: number, completedReps: number, minReps: number, maxReps: number, weight: number, duration: string, setType: string } | null> | null } | null> | null } | null };

export type WorkoutCreateCompletedMutationVariables = Exact<{
  input: WorkoutCreateCompletedInput;
}>;


export type WorkoutCreateCompletedMutation = { __typename?: 'Mutation', workoutCreateCompleted?: { __typename?: 'WorkoutCreateCompleted', workout?: { __typename?: 'WorkoutNode', id: string } | null, errors?: Array<{ __typename?: 'MessageNode', message?: string | null } | null> | null } | null };

export type WeekInReviewQueryVariables = Exact<{ [key: string]: never; }>;


export type WeekInReviewQuery = { __typename?: 'Query', weekInReview?: { __typename?: 'WeekInReview', message?: string | null, totalWorkouts?: number | null, totalVolume?: string | null, topMuscleGroup?: string | null, totalCardio?: string | null, favoriteEquipment?: string | null } | null };

export type GetWorkoutsQueryVariables = Exact<{
  startMonth?: InputMaybe<Scalars['Decimal']['input']>;
  startYear?: InputMaybe<Scalars['Decimal']['input']>;
}>;


export type GetWorkoutsQuery = { __typename?: 'Query', workouts?: { __typename?: 'WorkoutNodeConnection', edges: Array<{ __typename?: 'WorkoutNodeEdge', node?: { __typename?: 'WorkoutNode', id: string, startTime: any, name: string } | null } | null> } | null };

export type GetExercisesQueryVariables = Exact<{
  movementId?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetExercisesQuery = { __typename?: 'Query', exercises?: { __typename?: 'ExerciseNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'ExerciseNodeEdge', node?: { __typename?: 'ExerciseNode', id: string, movement: { __typename?: 'MovementNode', name: string, primaryMuscleGroup: string, equipmentType: string, movementType: string }, workout: { __typename?: 'WorkoutNode', startTime: any }, sets?: Array<{ __typename?: 'SetNode', id: string, sequenceNumber: number, completedReps: number, weight: number, duration: string, oneRepMax?: number | null, volume?: number | null } | null> | null } | null } | null> } | null };

export type GetMovementsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  equipment?: InputMaybe<Scalars['String']['input']>;
  muscle?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMovementsQuery = { __typename?: 'Query', movements?: { __typename?: 'MovementNodeConnection', edges: Array<{ __typename?: 'MovementNodeEdge', cursor: string, node?: { __typename?: 'MovementNode', id: string, name: string, description: string, primaryMuscleGroup: string, equipmentType: string, movementType: string } | null } | null> } | null };
