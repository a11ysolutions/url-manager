import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';

import { SUBMIT_URLS } from '../graphql/operations';
import {
  setSelectedUrls,
  setSelectedKeys,
  setFilter,
  clearFilters,
  clearSelections,
  setSubmissionState,
  setSubmissionResult,
  selectSelectedUrls,
  selectFilters,
  selectIsSubmitting,
  selectSubmissionResult,
  selectHasActiveFilters,
} from '../redux/selectionSlice';

import { extractFilterOptions } from '../utils/filterUtils';
import { filterUrls, parseUrlsToTree, convertToTreeNodes, extractSelectedUrls } from '../utils/urlUtils';
import { validateInputData } from '../utils/validation';

export const useUrlManager = (data) => {
  const dispatch = useDispatch();

  const originalUrls = useMemo(() => {
    if (!data) {
      return [];
    }
    
    if (!validateInputData(data)) {
      console.warn('Invalid data received:', data);
      return [];
    }
    return data?.urls || [];
  }, [data]);

  const selectedUrls = useSelector(selectSelectedUrls);
  const filters = useSelector(selectFilters);
  const isSubmitting = useSelector(selectIsSubmitting);
  const submissionResult = useSelector(selectSubmissionResult);
  const hasActiveFilters = useSelector(selectHasActiveFilters);

  const [submitUrlsMutation] = useMutation(SUBMIT_URLS);

  const filteredUrls = useMemo(() => {
    return filterUrls(originalUrls, filters);
  }, [originalUrls, filters]);

  const filterOptions = useMemo(() => {
    return extractFilterOptions(originalUrls);
  }, [originalUrls]);

  const treeNodes = useMemo(() => {
    if (filteredUrls.length === 0) return [];
    const treeData = parseUrlsToTree(filteredUrls);
    return convertToTreeNodes(treeData);
  }, [filteredUrls]);

  const selectedKeys = useSelector(state => state.selection.selectedKeys);

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

    dispatch(setSubmissionState(true));
    try {
      const { data: mutationData } = await submitUrlsMutation({
        variables: { urls: selectedUrls },
      });
      dispatch(setSubmissionResult(mutationData.submitUrls));
      dispatch(clearSelections());
    } catch (error) {
      console.error('Error submitting URLs:', error);
      dispatch(setSubmissionResult({
        success: false,
        message: error.message || 'Error en la submission',
      }));
    }
  }, [selectedUrls, submitUrlsMutation, dispatch]);

  return {
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
