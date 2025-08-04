import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client';

import { GET_URLS, SUBMIT_URLS } from '../graphql/operations';
import {
  setSelectedUrls,
  setSelectedKeys,
  setFilter,
  clearFilters,
  clearSelections,
  setSubmissionResult,
} from '../redux/selectionSlice';

import { extractFilterOptions } from '../utils/filterUtils';
import { filterUrls, parseUrlsToTree, convertToTreeNodes, extractSelectedUrls } from '../utils/urlUtils';

export const useUrlManager = () => {
  const dispatch = useDispatch();
  
  const { data, loading, error } = useQuery(GET_URLS);
  
  const {
    selectedUrls,
    selectedKeys,
    filters,
    submissionResult
  } = useSelector(state => state.selection);

  const [submitUrlsMutation, { loading: isSubmitting }] = useMutation(SUBMIT_URLS);

  const originalUrls = useMemo(() => data?.urls || [], [data]);

  const filteredUrls = useMemo(() => 
    filterUrls(originalUrls, filters), [originalUrls, filters]);

  const filterOptions = useMemo(() => 
    extractFilterOptions(originalUrls), [originalUrls]);

  const treeNodes = useMemo(() => {
    if (filteredUrls.length === 0) return [];
    const treeData = parseUrlsToTree(filteredUrls);
    return convertToTreeNodes(treeData);
  }, [filteredUrls]);

  const handleSelectionChange = useCallback((e) => {
    dispatch(setSelectedKeys(e.value));
    const newSelectedUrls = extractSelectedUrls(e.value, treeNodes);
    dispatch(setSelectedUrls(newSelectedUrls));
  }, [dispatch, treeNodes]);

  const handleFilterChange = useCallback((key, value) => {
    dispatch(setFilter({ key, value }));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleClearSelections = useCallback(() => {
    dispatch(clearSelections());
  }, [dispatch]);

  const handleSubmitUrls = useCallback(async () => {
    if (selectedUrls.length === 0) return;

    try {
      const { data: mutationData } = await submitUrlsMutation({
        variables: { urls: selectedUrls },
      });
      dispatch(setSubmissionResult(mutationData.submitUrls));
      dispatch(clearSelections());
    } catch (error) {
      dispatch(setSubmissionResult({
        success: false,
        message: 'Error en la submission',
      }));
    }
  }, [selectedUrls, submitUrlsMutation, dispatch]);

  const hasActiveFilters = useMemo(() => 
    Object.values(filters).some(value => value.length > 0), [filters]);

  return {
    loading,
    error,
    selectedUrls,
    filters,
    filterOptions,
    treeNodes,
    selectedKeys,
    isSubmitting,
    submissionResult,
    handleSelectionChange,
    handleFilterChange,
    handleClearFilters,
    handleClearSelections,
    handleSubmitUrls,
    hasActiveFilters,
    hasSelectedUrls: selectedUrls.length > 0,
    filteredUrlsCount: filteredUrls.length,
    totalUrlsCount: originalUrls.length,
  };
};