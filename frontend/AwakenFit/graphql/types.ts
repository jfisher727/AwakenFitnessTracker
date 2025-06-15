import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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

export type MovementCreate = {
  __typename?: 'MovementCreate';
  errors?: Maybe<Array<Maybe<MessageNode>>>;
  movement?: Maybe<MovementNode>;
};

export type MovementCreateInput = {
  description: Scalars['String']['input'];
  equipmentType: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
  name: Scalars['String']['input'];
  primaryMuscleGroup: Scalars['String']['input'];
  secondaryMuscleGroup: Scalars['String']['input'];
};

export type MovementEdit = {
  __typename?: 'MovementEdit';
  errors?: Maybe<Array<Maybe<MessageNode>>>;
  movement?: Maybe<MovementNode>;
};

export type MovementEditInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  equipmentType: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  movementType: Scalars['String']['input'];
  primaryMuscleGroup: Scalars['String']['input'];
  secondaryMuscleGroup: Scalars['String']['input'];
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
  movementCreate?: Maybe<MovementCreate>;
  movementEdit?: Maybe<MovementEdit>;
  workoutCreateCompleted?: Maybe<WorkoutCreateCompleted>;
  workoutCreateTemplate?: Maybe<WorkoutCreateTemplate>;
};


export type MutationMovementCreateArgs = {
  input: MovementCreateInput;
};


export type MutationMovementEditArgs = {
  input: MovementEditInput;
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
  isSuperUser?: Maybe<Scalars['Boolean']['output']>;
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

export type WorkoutCreateCompletedMutationVariables = Exact<{
  input: WorkoutCreateCompletedInput;
}>;


export type WorkoutCreateCompletedMutation = { __typename?: 'Mutation', workoutCreateCompleted?: { __typename?: 'WorkoutCreateCompleted', workout?: { __typename?: 'WorkoutNode', id: string } | null, errors?: Array<{ __typename?: 'MessageNode', message?: string | null } | null> | null } | null };

export type MovementCreateMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  primaryMuscleGroup: Scalars['String']['input'];
  secondaryMuscleGroup: Scalars['String']['input'];
  equipmentType: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
}>;


export type MovementCreateMutation = { __typename?: 'Mutation', movementCreate?: { __typename?: 'MovementCreate', movement?: { __typename?: 'MovementNode', id: string } | null, errors?: Array<{ __typename?: 'MessageNode', message?: string | null } | null> | null } | null };

export type MovementEditMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  primaryMuscleGroup: Scalars['String']['input'];
  secondaryMuscleGroup: Scalars['String']['input'];
  equipmentType: Scalars['String']['input'];
  movementType: Scalars['String']['input'];
}>;


export type MovementEditMutation = { __typename?: 'Mutation', movementEdit?: { __typename?: 'MovementEdit', movement?: { __typename?: 'MovementNode', id: string } | null, errors?: Array<{ __typename?: 'MessageNode', message?: string | null } | null> | null } | null };

export type WorkoutCreateTemplateMutationVariables = Exact<{
  input: WorkoutCreateTemplateInput;
}>;


export type WorkoutCreateTemplateMutation = { __typename?: 'Mutation', workoutCreateTemplate?: { __typename?: 'WorkoutCreateTemplate', workout?: { __typename?: 'WorkoutNode', id: string } | null, errors?: Array<{ __typename?: 'MessageNode', message?: string | null } | null> | null } | null };

export type GetExercisesQueryVariables = Exact<{
  movementId?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetExercisesQuery = { __typename?: 'Query', exercises?: { __typename?: 'ExerciseNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'ExerciseNodeEdge', node?: { __typename?: 'ExerciseNode', id: string, movement: { __typename?: 'MovementNode', name: string, primaryMuscleGroup: string, equipmentType: string, movementType: string }, workout: { __typename?: 'WorkoutNode', startTime: any }, sets?: Array<{ __typename?: 'SetNode', id: string, sequenceNumber: number, completedReps: number, weight: number, duration: string, oneRepMax?: number | null, volume?: number | null } | null> | null } | null } | null> } | null };

export type GetIsSuperuserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIsSuperuserQuery = { __typename?: 'Query', isSuperUser?: boolean | null };

export type GetMovementsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  equipment?: InputMaybe<Scalars['String']['input']>;
  muscle?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMovementsQuery = { __typename?: 'Query', movements?: { __typename?: 'MovementNodeConnection', edges: Array<{ __typename?: 'MovementNodeEdge', cursor: string, node?: { __typename?: 'MovementNode', id: string, name: string, description: string, primaryMuscleGroup: string, equipmentType: string, movementType: string } | null } | null> } | null };

export type WeekInReviewQueryVariables = Exact<{ [key: string]: never; }>;


export type WeekInReviewQuery = { __typename?: 'Query', weekInReview?: { __typename?: 'WeekInReview', message?: string | null, totalWorkouts?: number | null, totalVolume?: string | null, topMuscleGroup?: string | null, totalCardio?: string | null, favoriteEquipment?: string | null } | null };

export type GetWorkoutQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWorkoutQuery = { __typename?: 'Query', workout?: { __typename?: 'WorkoutNode', id: string, name: string, notes: string, exercises?: Array<{ __typename?: 'ExerciseNode', id: string, notes: string, movement: { __typename?: 'MovementNode', id: string, name: string, description: string, primaryMuscleGroup: string, equipmentType: string, movementType: string }, sets?: Array<{ __typename?: 'SetNode', id: string, sequenceNumber: number, completedReps: number, minReps: number, maxReps: number, weight: number, duration: string, setType: string } | null> | null } | null> | null } | null };

export type GetWorkoutTemplatesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  template?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetWorkoutTemplatesQuery = { __typename?: 'Query', workouts?: { __typename?: 'WorkoutNodeConnection', edges: Array<{ __typename?: 'WorkoutNodeEdge', cursor: string, node?: { __typename?: 'WorkoutNode', id: string, name: string, notes: string, exercises?: Array<{ __typename?: 'ExerciseNode', id: string, notes: string, movement: { __typename?: 'MovementNode', name: string, description: string, primaryMuscleGroup: string, equipmentType: string, movementType: string }, sets?: Array<{ __typename?: 'SetNode', id: string, sequenceNumber: number, minReps: number, maxReps: number, duration: string, setType: string } | null> | null } | null> | null } | null } | null> } | null };

export type GetWorkoutsQueryVariables = Exact<{
  startMonth?: InputMaybe<Scalars['Decimal']['input']>;
  startYear?: InputMaybe<Scalars['Decimal']['input']>;
}>;


export type GetWorkoutsQuery = { __typename?: 'Query', workouts?: { __typename?: 'WorkoutNodeConnection', edges: Array<{ __typename?: 'WorkoutNodeEdge', node?: { __typename?: 'WorkoutNode', id: string, startTime: any, name: string } | null } | null> } | null };


export const WorkoutCreateCompletedDocument = gql`
    mutation WorkoutCreateCompleted($input: WorkoutCreateCompletedInput!) {
  workoutCreateCompleted(input: $input) {
    workout {
      id
    }
    errors {
      message
    }
  }
}
    `;
export type WorkoutCreateCompletedMutationFn = Apollo.MutationFunction<WorkoutCreateCompletedMutation, WorkoutCreateCompletedMutationVariables>;

/**
 * __useWorkoutCreateCompletedMutation__
 *
 * To run a mutation, you first call `useWorkoutCreateCompletedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkoutCreateCompletedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workoutCreateCompletedMutation, { data, loading, error }] = useWorkoutCreateCompletedMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWorkoutCreateCompletedMutation(baseOptions?: Apollo.MutationHookOptions<WorkoutCreateCompletedMutation, WorkoutCreateCompletedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkoutCreateCompletedMutation, WorkoutCreateCompletedMutationVariables>(WorkoutCreateCompletedDocument, options);
      }
export type WorkoutCreateCompletedMutationHookResult = ReturnType<typeof useWorkoutCreateCompletedMutation>;
export type WorkoutCreateCompletedMutationResult = Apollo.MutationResult<WorkoutCreateCompletedMutation>;
export type WorkoutCreateCompletedMutationOptions = Apollo.BaseMutationOptions<WorkoutCreateCompletedMutation, WorkoutCreateCompletedMutationVariables>;
export const MovementCreateDocument = gql`
    mutation movementCreate($name: String!, $description: String!, $primaryMuscleGroup: String!, $secondaryMuscleGroup: String!, $equipmentType: String!, $movementType: String!) {
  movementCreate(
    input: {name: $name, description: $description, primaryMuscleGroup: $primaryMuscleGroup, secondaryMuscleGroup: $secondaryMuscleGroup, equipmentType: $equipmentType, movementType: $movementType}
  ) {
    movement {
      id
    }
    errors {
      message
    }
  }
}
    `;
export type MovementCreateMutationFn = Apollo.MutationFunction<MovementCreateMutation, MovementCreateMutationVariables>;

/**
 * __useMovementCreateMutation__
 *
 * To run a mutation, you first call `useMovementCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMovementCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [movementCreateMutation, { data, loading, error }] = useMovementCreateMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      primaryMuscleGroup: // value for 'primaryMuscleGroup'
 *      secondaryMuscleGroup: // value for 'secondaryMuscleGroup'
 *      equipmentType: // value for 'equipmentType'
 *      movementType: // value for 'movementType'
 *   },
 * });
 */
export function useMovementCreateMutation(baseOptions?: Apollo.MutationHookOptions<MovementCreateMutation, MovementCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MovementCreateMutation, MovementCreateMutationVariables>(MovementCreateDocument, options);
      }
export type MovementCreateMutationHookResult = ReturnType<typeof useMovementCreateMutation>;
export type MovementCreateMutationResult = Apollo.MutationResult<MovementCreateMutation>;
export type MovementCreateMutationOptions = Apollo.BaseMutationOptions<MovementCreateMutation, MovementCreateMutationVariables>;
export const MovementEditDocument = gql`
    mutation movementEdit($id: ID!, $description: String, $primaryMuscleGroup: String!, $secondaryMuscleGroup: String!, $equipmentType: String!, $movementType: String!) {
  movementEdit(
    input: {id: $id, description: $description, primaryMuscleGroup: $primaryMuscleGroup, secondaryMuscleGroup: $secondaryMuscleGroup, equipmentType: $equipmentType, movementType: $movementType}
  ) {
    movement {
      id
    }
    errors {
      message
    }
  }
}
    `;
export type MovementEditMutationFn = Apollo.MutationFunction<MovementEditMutation, MovementEditMutationVariables>;

/**
 * __useMovementEditMutation__
 *
 * To run a mutation, you first call `useMovementEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMovementEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [movementEditMutation, { data, loading, error }] = useMovementEditMutation({
 *   variables: {
 *      id: // value for 'id'
 *      description: // value for 'description'
 *      primaryMuscleGroup: // value for 'primaryMuscleGroup'
 *      secondaryMuscleGroup: // value for 'secondaryMuscleGroup'
 *      equipmentType: // value for 'equipmentType'
 *      movementType: // value for 'movementType'
 *   },
 * });
 */
export function useMovementEditMutation(baseOptions?: Apollo.MutationHookOptions<MovementEditMutation, MovementEditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MovementEditMutation, MovementEditMutationVariables>(MovementEditDocument, options);
      }
export type MovementEditMutationHookResult = ReturnType<typeof useMovementEditMutation>;
export type MovementEditMutationResult = Apollo.MutationResult<MovementEditMutation>;
export type MovementEditMutationOptions = Apollo.BaseMutationOptions<MovementEditMutation, MovementEditMutationVariables>;
export const WorkoutCreateTemplateDocument = gql`
    mutation WorkoutCreateTemplate($input: WorkoutCreateTemplateInput!) {
  workoutCreateTemplate(input: $input) {
    workout {
      id
    }
    errors {
      message
    }
  }
}
    `;
export type WorkoutCreateTemplateMutationFn = Apollo.MutationFunction<WorkoutCreateTemplateMutation, WorkoutCreateTemplateMutationVariables>;

/**
 * __useWorkoutCreateTemplateMutation__
 *
 * To run a mutation, you first call `useWorkoutCreateTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkoutCreateTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workoutCreateTemplateMutation, { data, loading, error }] = useWorkoutCreateTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWorkoutCreateTemplateMutation(baseOptions?: Apollo.MutationHookOptions<WorkoutCreateTemplateMutation, WorkoutCreateTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkoutCreateTemplateMutation, WorkoutCreateTemplateMutationVariables>(WorkoutCreateTemplateDocument, options);
      }
export type WorkoutCreateTemplateMutationHookResult = ReturnType<typeof useWorkoutCreateTemplateMutation>;
export type WorkoutCreateTemplateMutationResult = Apollo.MutationResult<WorkoutCreateTemplateMutation>;
export type WorkoutCreateTemplateMutationOptions = Apollo.BaseMutationOptions<WorkoutCreateTemplateMutation, WorkoutCreateTemplateMutationVariables>;
export const GetExercisesDocument = gql`
    query GetExercises($movementId: String, $after: String, $before: String, $count: Int) {
  exercises(
    movementId: $movementId
    after: $after
    before: $before
    first: $count
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        movement {
          name
          primaryMuscleGroup
          equipmentType
          movementType
        }
        workout {
          startTime
        }
        sets {
          id
          sequenceNumber
          completedReps
          weight
          duration
          oneRepMax
          volume
        }
      }
    }
  }
}
    `;

/**
 * __useGetExercisesQuery__
 *
 * To run a query within a React component, call `useGetExercisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExercisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExercisesQuery({
 *   variables: {
 *      movementId: // value for 'movementId'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      count: // value for 'count'
 *   },
 * });
 */
export function useGetExercisesQuery(baseOptions?: Apollo.QueryHookOptions<GetExercisesQuery, GetExercisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExercisesQuery, GetExercisesQueryVariables>(GetExercisesDocument, options);
      }
export function useGetExercisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExercisesQuery, GetExercisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExercisesQuery, GetExercisesQueryVariables>(GetExercisesDocument, options);
        }
export function useGetExercisesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExercisesQuery, GetExercisesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExercisesQuery, GetExercisesQueryVariables>(GetExercisesDocument, options);
        }
export type GetExercisesQueryHookResult = ReturnType<typeof useGetExercisesQuery>;
export type GetExercisesLazyQueryHookResult = ReturnType<typeof useGetExercisesLazyQuery>;
export type GetExercisesSuspenseQueryHookResult = ReturnType<typeof useGetExercisesSuspenseQuery>;
export type GetExercisesQueryResult = Apollo.QueryResult<GetExercisesQuery, GetExercisesQueryVariables>;
export const GetIsSuperuserDocument = gql`
    query GetIsSuperuser {
  isSuperUser
}
    `;

/**
 * __useGetIsSuperuserQuery__
 *
 * To run a query within a React component, call `useGetIsSuperuserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIsSuperuserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIsSuperuserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetIsSuperuserQuery(baseOptions?: Apollo.QueryHookOptions<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>(GetIsSuperuserDocument, options);
      }
export function useGetIsSuperuserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>(GetIsSuperuserDocument, options);
        }
export function useGetIsSuperuserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>(GetIsSuperuserDocument, options);
        }
export type GetIsSuperuserQueryHookResult = ReturnType<typeof useGetIsSuperuserQuery>;
export type GetIsSuperuserLazyQueryHookResult = ReturnType<typeof useGetIsSuperuserLazyQuery>;
export type GetIsSuperuserSuspenseQueryHookResult = ReturnType<typeof useGetIsSuperuserSuspenseQuery>;
export type GetIsSuperuserQueryResult = Apollo.QueryResult<GetIsSuperuserQuery, GetIsSuperuserQueryVariables>;
export const GetMovementsDocument = gql`
    query GetMovements($after: String, $name: String, $count: Int, $equipment: String, $muscle: String) {
  movements(
    after: $after
    name_Icontains: $name
    first: $count
    equipmentType: $equipment
    primaryMuscleGroup: $muscle
  ) {
    edges {
      cursor
      node {
        id
        name
        description
        primaryMuscleGroup
        equipmentType
        movementType
      }
    }
  }
}
    `;

/**
 * __useGetMovementsQuery__
 *
 * To run a query within a React component, call `useGetMovementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMovementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMovementsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      name: // value for 'name'
 *      count: // value for 'count'
 *      equipment: // value for 'equipment'
 *      muscle: // value for 'muscle'
 *   },
 * });
 */
export function useGetMovementsQuery(baseOptions?: Apollo.QueryHookOptions<GetMovementsQuery, GetMovementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMovementsQuery, GetMovementsQueryVariables>(GetMovementsDocument, options);
      }
export function useGetMovementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMovementsQuery, GetMovementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMovementsQuery, GetMovementsQueryVariables>(GetMovementsDocument, options);
        }
export function useGetMovementsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMovementsQuery, GetMovementsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMovementsQuery, GetMovementsQueryVariables>(GetMovementsDocument, options);
        }
export type GetMovementsQueryHookResult = ReturnType<typeof useGetMovementsQuery>;
export type GetMovementsLazyQueryHookResult = ReturnType<typeof useGetMovementsLazyQuery>;
export type GetMovementsSuspenseQueryHookResult = ReturnType<typeof useGetMovementsSuspenseQuery>;
export type GetMovementsQueryResult = Apollo.QueryResult<GetMovementsQuery, GetMovementsQueryVariables>;
export const WeekInReviewDocument = gql`
    query weekInReview {
  weekInReview {
    message
    totalWorkouts
    totalVolume
    topMuscleGroup
    totalCardio
    favoriteEquipment
  }
}
    `;

/**
 * __useWeekInReviewQuery__
 *
 * To run a query within a React component, call `useWeekInReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useWeekInReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWeekInReviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useWeekInReviewQuery(baseOptions?: Apollo.QueryHookOptions<WeekInReviewQuery, WeekInReviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WeekInReviewQuery, WeekInReviewQueryVariables>(WeekInReviewDocument, options);
      }
export function useWeekInReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WeekInReviewQuery, WeekInReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WeekInReviewQuery, WeekInReviewQueryVariables>(WeekInReviewDocument, options);
        }
export function useWeekInReviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WeekInReviewQuery, WeekInReviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WeekInReviewQuery, WeekInReviewQueryVariables>(WeekInReviewDocument, options);
        }
export type WeekInReviewQueryHookResult = ReturnType<typeof useWeekInReviewQuery>;
export type WeekInReviewLazyQueryHookResult = ReturnType<typeof useWeekInReviewLazyQuery>;
export type WeekInReviewSuspenseQueryHookResult = ReturnType<typeof useWeekInReviewSuspenseQuery>;
export type WeekInReviewQueryResult = Apollo.QueryResult<WeekInReviewQuery, WeekInReviewQueryVariables>;
export const GetWorkoutDocument = gql`
    query GetWorkout($id: ID!) {
  workout(id: $id) {
    id
    name
    notes
    exercises {
      id
      notes
      movement {
        id
        name
        description
        primaryMuscleGroup
        equipmentType
        movementType
      }
      sets {
        id
        sequenceNumber
        completedReps
        minReps
        maxReps
        weight
        duration
        setType
      }
    }
  }
}
    `;

/**
 * __useGetWorkoutQuery__
 *
 * To run a query within a React component, call `useGetWorkoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkoutQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetWorkoutQuery(baseOptions: Apollo.QueryHookOptions<GetWorkoutQuery, GetWorkoutQueryVariables> & ({ variables: GetWorkoutQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkoutQuery, GetWorkoutQueryVariables>(GetWorkoutDocument, options);
      }
export function useGetWorkoutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkoutQuery, GetWorkoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkoutQuery, GetWorkoutQueryVariables>(GetWorkoutDocument, options);
        }
export function useGetWorkoutSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkoutQuery, GetWorkoutQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWorkoutQuery, GetWorkoutQueryVariables>(GetWorkoutDocument, options);
        }
export type GetWorkoutQueryHookResult = ReturnType<typeof useGetWorkoutQuery>;
export type GetWorkoutLazyQueryHookResult = ReturnType<typeof useGetWorkoutLazyQuery>;
export type GetWorkoutSuspenseQueryHookResult = ReturnType<typeof useGetWorkoutSuspenseQuery>;
export type GetWorkoutQueryResult = Apollo.QueryResult<GetWorkoutQuery, GetWorkoutQueryVariables>;
export const GetWorkoutTemplatesDocument = gql`
    query GetWorkoutTemplates($after: String, $count: Int, $name: String, $template: Boolean) {
  workouts(
    after: $after
    first: $count
    name_Icontains: $name
    template: $template
  ) {
    edges {
      cursor
      node {
        id
        name
        notes
        exercises {
          id
          notes
          movement {
            name
            description
            primaryMuscleGroup
            equipmentType
            movementType
          }
          sets {
            id
            sequenceNumber
            minReps
            maxReps
            duration
            setType
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetWorkoutTemplatesQuery__
 *
 * To run a query within a React component, call `useGetWorkoutTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkoutTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkoutTemplatesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      count: // value for 'count'
 *      name: // value for 'name'
 *      template: // value for 'template'
 *   },
 * });
 */
export function useGetWorkoutTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>(GetWorkoutTemplatesDocument, options);
      }
export function useGetWorkoutTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>(GetWorkoutTemplatesDocument, options);
        }
export function useGetWorkoutTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>(GetWorkoutTemplatesDocument, options);
        }
export type GetWorkoutTemplatesQueryHookResult = ReturnType<typeof useGetWorkoutTemplatesQuery>;
export type GetWorkoutTemplatesLazyQueryHookResult = ReturnType<typeof useGetWorkoutTemplatesLazyQuery>;
export type GetWorkoutTemplatesSuspenseQueryHookResult = ReturnType<typeof useGetWorkoutTemplatesSuspenseQuery>;
export type GetWorkoutTemplatesQueryResult = Apollo.QueryResult<GetWorkoutTemplatesQuery, GetWorkoutTemplatesQueryVariables>;
export const GetWorkoutsDocument = gql`
    query GetWorkouts($startMonth: Decimal, $startYear: Decimal) {
  workouts(startMonth: $startMonth, startYear: $startYear, template: false) {
    edges {
      node {
        id
        startTime
        name
      }
    }
  }
}
    `;

/**
 * __useGetWorkoutsQuery__
 *
 * To run a query within a React component, call `useGetWorkoutsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkoutsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkoutsQuery({
 *   variables: {
 *      startMonth: // value for 'startMonth'
 *      startYear: // value for 'startYear'
 *   },
 * });
 */
export function useGetWorkoutsQuery(baseOptions?: Apollo.QueryHookOptions<GetWorkoutsQuery, GetWorkoutsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkoutsQuery, GetWorkoutsQueryVariables>(GetWorkoutsDocument, options);
      }
export function useGetWorkoutsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkoutsQuery, GetWorkoutsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkoutsQuery, GetWorkoutsQueryVariables>(GetWorkoutsDocument, options);
        }
export function useGetWorkoutsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWorkoutsQuery, GetWorkoutsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWorkoutsQuery, GetWorkoutsQueryVariables>(GetWorkoutsDocument, options);
        }
export type GetWorkoutsQueryHookResult = ReturnType<typeof useGetWorkoutsQuery>;
export type GetWorkoutsLazyQueryHookResult = ReturnType<typeof useGetWorkoutsLazyQuery>;
export type GetWorkoutsSuspenseQueryHookResult = ReturnType<typeof useGetWorkoutsSuspenseQuery>;
export type GetWorkoutsQueryResult = Apollo.QueryResult<GetWorkoutsQuery, GetWorkoutsQueryVariables>;
