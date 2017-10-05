{-# LANGUAGE OverloadedStrings #-}

module DynamicGraphs.GraphGenerator
  (sampleGraph)
  where

import Data.GraphViz.Attributes as A
import Data.GraphViz.Attributes.Complete as AC
import Data.GraphViz.Types.Generalised (
  DotEdge(..),
  DotGraph(..),
  DotNode(..),
  DotStatement(..),
  GlobalAttributes(..))
import Database.Requirement (Req(..))
import Data.Sequence as Seq
import Data.Text.Lazy (Text, pack)

type StmtsWithCounter = ([DotStatement Text], Int)

-- Serves as a sort of "interface" for the whole part "dynamic graph"
sampleGraph :: DotGraph Text
sampleGraph = reqsToGraph [
    ("CSC148H1", RAW "some literal requirements")
    ]

-- ** Main algorithm for converting requirements into a graph

-- The reqToStmts are meant to convert a single requirement and reqsToGraph use concatMap to 
-- use reqToStmts to converts a list of requirements all at once and concatenate the results into a 
-- single list of DotGraph objects.
reqsToGraph :: [(Text, Req)] -> DotGraph Text
reqsToGraph reqs =
    let (stmts, _) = foldUpReqLst reqs 0
    in
        buildGraph stmts

-- Convert the original requirement data into dot statements that can be used by buildGraph to create the
-- corresponding DotGraph objects. ([] is the [] after name the optional parameters for DotNode?)
reqToStmts :: StmtsWithCounter -> (Text, Req) -> StmtsWithCounter
reqToStmts (stmtslst, counter) (name, NONE) = let stmtslst0 = let stmtslst1 = stmtslst 
                                                                  counter1 = counter
                                                              in  stmtslst1 ++ [DN $ DotNode (mappendTextWithCounter name counter1) []]
                                                  counter0 =  let counter2 = counter
                                                              in  (counter2 + 1)
                                              in  (stmtslst0, counter0)

reqToStmts (stmtslst, counter) (name, J string1) = let (stmtslst0, _) = foldUpReqLst [(name, NONE), (str1, NONE)] 0
                                                   in ([DE $ DotEdge str1 name []] ++ stmtslst0, counter + 3)
  where str1 = pack string1

reqToStmts (stmtslst, counter) (name, AND reqs1) = ([DN $ DotNode (mappendTextWithCounter "and" (counter_sub + 1000)) [], 
                                                    DE $ DotEdge (mappendTextWithCounter "and" (counter_sub + 1000)) 
                                                    (mappendTextWithCounter name counter) []] ++ 
                                                    statements_sub, counter_sub + 1)
  where createSingleSubStmt = createSubnodeCorrespondingEdge (mappendTextWithCounter "and" (counter_sub + 1000))
        (statements_sub, counter_sub) = foldl(\acc x -> createSingleSubStmt acc x) (reqToStmts (stmtslst, counter) (name, NONE)) (decompJString reqs1)

reqToStmts (stmtslst, counter) (name, OR reqs1) = ([DN $ DotNode (mappendTextWithCounter "or" (counter_sub + 1000)) [], 
                                                    DE $ DotEdge (mappendTextWithCounter "or" (counter_sub + 1000)) 
                                                    (mappendTextWithCounter name counter) []] ++ 
                                                    statements_sub, counter_sub + 1)
  where createSingleSubStmt = createSubnodeCorrespondingEdge (mappendTextWithCounter "or" (counter_sub + 1000))
        (statements_sub, counter_sub) = foldl(\acc x -> createSingleSubStmt acc x) (reqToStmts (stmtslst, counter) (name, NONE)) (decompJString reqs1)

reqToStmts (stmtslst, counter) (name, FROM string1 (J string2)) = ([DN $ DotNode (mappendTextWithCounter (pack string1) (counter_sub + 1000)) [], 
                                                                    DE $ DotEdge (mappendTextWithCounter (pack string1) (counter_sub + 1000)) 
                                                                    (mappendTextWithCounter name counter) []] ++ 
                                                                    statements_sub, counter_sub + 1)
  where createSingleSubStmt = createSubnodeCorrespondingEdge (mappendTextWithCounter (pack string1) (counter_sub + 1000))
        (statements_sub, counter_sub) = foldl(\acc x -> createSingleSubStmt acc x) (reqToStmts (stmtslst, counter) (name, NONE)) [((pack string2), NONE)]

reqToStmts (stmtslst, counter) (name, GRADE string1 (J string2)) = ([DN $ DotNode (mappendTextWithCounter (pack string1) (counter_sub + 1000)) [], 
                                                                    DE $ DotEdge (mappendTextWithCounter (pack string1) (counter_sub + 1000)) 
                                                                    (mappendTextWithCounter name counter) []] ++ 
                                                                    statements_sub, counter_sub + 1)
  where createSingleSubStmt = createSubnodeCorrespondingEdge (mappendTextWithCounter (pack string1) (counter_sub + 1000))
        (statements_sub, counter_sub) = foldl(\acc x -> createSingleSubStmt acc x) (reqToStmts (stmtslst, counter) (name, NONE)) [((pack string2), NONE)]

reqToStmts (stmtslst, counter) (name, RAW string1) = ([DN $ DotNode (mappendTextWithCounter (pack string1) counter) [], 
                                                       DE $ DotEdge (mappendTextWithCounter (pack string1) counter) 
                                                       (mappendTextWithCounter name counter) []], counter + 1)

foldUpReqLst :: [(Text, Req)] -> Int -> StmtsWithCounter
foldUpReqLst reqlst count = foldl(\acc x -> reqToStmts acc x) ([], count) reqlst

createSubnodeCorrespondingEdge :: Text -> StmtsWithCounter -> (Text, Req) -> StmtsWithCounter
createSubnodeCorrespondingEdge parentnode (stmtslst, counter) (name, NONE) = let stmtslst1 = stmtslst ++ [DE $ DotEdge (mappendTextWithCounter name counter) 
                                                                                                          parentnode []]
                                                                             in reqToStmts (stmtslst1, counter) (name, NONE)

mappendTextWithCounter :: Text -> Int -> Text
mappendTextWithCounter text1 counter = text1 `mappend` "_counter_" `mappend` (pack (show (counter))) 

-- Now this only wotks for Req lists of J String. Failed if using [Req] as input and pack x in foldl.
decompJString :: [Req] -> [(Text, Req)]
decompJString [] = []
decompJString ((J x):xs) = (pack x, NONE):(decompJString xs)

createAndEdge :: Int -> Int -> [Text] -> [DotStatement Text]
createAndEdge counter_node counter_and [] = []
createAndEdge counter_node counter_and xs = foldl(\acc x -> [DE $ DotEdge (x `mappend` (pack (show (counter_node)))) 
                                                             ("and" `mappend` (pack (show (counter_and)))) []] ++ acc) [] xs

createOrEdge :: Int -> Int -> [Text] -> [DotStatement Text]
createOrEdge counter_node counter_or [] = []
createOrEdge counter_node counter_or xs = foldl(\acc x -> [DE $ DotEdge (x `mappend` (pack (show (counter_node)))) 
                                                            ("or" `mappend` (pack (show (counter_or)))) []] ++ acc) [] xs

dragNodeIdInReq :: [Req] -> [Text]
dragNodeIdInReq [] = []
dragNodeIdInReq ((J text1):xs) = (pack text1):(dragNodeIdInReq xs)

-- ** Graphviz configuration

-- With the dot statements converted from original requirement data as input, create the corresponding DotGraph
-- object with predefined hyperparameters (here, the hyperparameters defines that 1.graph can have multi-edges
-- 2.graph edges have directions 3.graphID not defined(not so clear) 4.the graph layout, node shape, edge shape 
-- are defined by the attributes as below)
buildGraph :: [DotStatement Text] -> DotGraph Text
buildGraph statements = DotGraph {
    strictGraph = False,
    directedGraph = True,
    graphID = Nothing,
    graphStatements = Seq.fromList $ [
        GA graphAttrs,
        GA nodeAttrs,
        GA edgeAttrs
        ] ++ statements
    }

-- Means the layout of the full graph is from left to right.
graphAttrs :: GlobalAttributes
graphAttrs = GraphAttrs [AC.RankDir AC.FromLeft]

-- Means the shape of each node in the graph is circle with width 1, and is filled.
nodeAttrs :: GlobalAttributes
nodeAttrs = NodeAttrs [A.shape A.Circle, AC.Width 1, A.style A.filled]

-- Using default setting for the edges connecting the nodes.
edgeAttrs :: GlobalAttributes
edgeAttrs = EdgeAttrs []
